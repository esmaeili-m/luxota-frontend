<!-- pages/trash.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Trashed Products</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><NuxtLink to="/dashboard/products">Products</NuxtLink></li>
          <li class="breadcrumb-item active" aria-current="page">Trash</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Trashed Products
          </div>
          <div class="prism-toggle">
            <NuxtLink to="/dashboard/products" class="btn btn-sm btn-primary-light">Back to Products<i
                class="ri-arrow-left-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingProducts" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="trashedProducts.length === 0">
            <EmptyState icon-class="ri-delete-bin-line" />
          </div>
          <div v-else class="table-responsive">
            <table class="table text-nowrap">
              <thead class="table-warning">
              <tr>
                <th class="col-width-100">#</th>
                <th>Title</th>
                <th>Product Code</th>
                <th>Category</th>
                <th>Version</th>
                <th>Order</th>
                <th>Deleted At</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(product, index) in trashedProducts" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product.title.en }}</td>
                <td>{{ product.product_code || 'N/A' }}</td>
                <td>{{ product.category?.title?.en || 'N/A' }}</td>
                <td>{{ product.version || 'N/A' }}</td>
                <td>{{ product.order || 'N/A' }}</td>
                <td>{{ formatDate(product.deleted_at) }}</td>
                <td>
                  <div class="btn-group my-1">
                    <button type="button" class="btn btn-sm btn-light">...</button>
                    <button type="button"
                            class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split me-2"
                            data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a @click="restoreProduct(product.id)" class="dropdown-item">Restore</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#force-delete"  @click="setProduct(product.id)" class="dropdown-item modal-effect"  href="#force-delete">Permanently Delete</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Force Delete Modal -->
  <div class="modal fade" id="force-delete" tabindex="-1" aria-labelledby="force-delete" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="forceDeleteModalLabel">Permanently Delete Product</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to <strong>permanently delete</strong> product <strong>{{ productName }}</strong>?</p>
          <p class="text-danger">Warning: This action cannot be undone and will permanently remove the product from the database.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmForceDeleteProduct"
          >
            {{ isDeleting ? 'Loading...' : 'Yes, Permanently Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watchEffect, reactive } from 'vue'
const nuxtApp = useNuxtApp()
definePageMeta({
  layout: 'dashboard',
})
const config = useRuntimeConfig()
const isLoadingProducts = ref(false)
const trashedProducts = ref([])
const error = reactive({})
const isDeleting = ref(false)
const selectedProductId = ref(null)
const productName = ref('')

function setProduct(id) {
  selectedProductId.value = id
  const product = trashedProducts.value.find(p => p.id === id)
  productName.value = product ? product.title.en : 'Unknown Product'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

watchEffect(() => {
  fetchTrashedProducts()
})

async function fetchTrashedProducts() {
  error.value = null
  isLoadingProducts.value = true
  try {
    const { data: response } = await useFetch('/products/trash', {
      baseURL: config.public.apiBase
    })
    trashedProducts.value = response.value.data || []
  } catch (e) {
    error.value = e
    console.error('Error fetching trashed products:', e)
  } finally {
    isLoadingProducts.value = false
  }
}

async function restoreProduct(productId) {
  try {
    await $fetch(`/products/${productId}/restore`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    nuxtApp.$toast({
      title: 'Success!',
      message: 'Product restored successfully.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedProducts()
  } catch (error) {
    console.error('Error restoring product:', error)
    nuxtApp.$toast({
      title: 'Error!',
      message: 'Failed to restore product.',
      type: 'error',
      duration: 3000
    })
  }
}

async function confirmForceDeleteProduct() {
  if (!selectedProductId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/products/force-delete/${selectedProductId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('force-delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to permanently delete product.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'Success!',
      message: 'Product permanently deleted.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedProducts()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
  }
}
</script> 