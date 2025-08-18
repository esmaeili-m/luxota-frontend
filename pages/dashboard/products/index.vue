<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Products</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">Products</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Products
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('product.create')"
                      @click="openModal()"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">Create Product<i
                  class="ri-add-line ms-2 d-inline-block align-middle"></i></button>
              <NuxtLink v-if="auth.user.permissions.includes('product.trash')" to="/dashboard/products/trash" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingProducts" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!products?.data || products.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Title</th>
                  <th>Product Code</th>
                  <th>Category</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(product, index) in products?.data" :key="product.id">
                  <td>{{ ((page || 1) - 1) * (perPage || 15) + (index || 0) + 1 }}</td>
                  <td>{{ product.title.en }}</td>
                  <td>{{ product.product_code || 'N/A' }}</td>
                  <td>{{ product.category?.title?.en || 'N/A' }}</td>
                  <td>
                  <span class="badge badge-lg rounded-pill" :class="product.payment_type ? 'bg-primary-transparent' : 'bg-warning-transparent'">
                    {{ product.payment_type ? 'Monthly Subscription' : 'One-Time Payment' }}
                  </span>
                  </td>
                  <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      product.status ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === product.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(product)"
                        :style="{ pointerEvents: isLoadingId === product.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === product.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ product.status ? 'Active' : 'Inactive' }}
                    </template>
                  </span>
                  </td>
                  <td>
                    <div class="btn-group my-1">
                      <button type="button" class="btn btn-sm btn-light">...</button>
                      <button type="button"
                              class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split me-2"
                              data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="visually-hidden">Toggle Dropdown</span>
                      </button>
                      <ul class="dropdown-menu">
                        <li v-if="auth.user.permissions.includes('product.price')">
                          <nuxt-link :to="`/dashboard/products/prices/${product.id}`" class="dropdown-item modal-effect">Pricing</nuxt-link>
                        </li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('product.update')"><a
                               @click="openModal(product)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect"  >Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('product.delete')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setProduct(product.id)" class="dropdown-item modal-effect"  href="#delete">Delete</a></li>

                      </ul>
                    </div>

                  </td>
                </tr>

                </tbody>


              </table>
              <nav aria-label="Page navigation" class="pagination-style-4 mt-2">
                <ul class="pagination mb-0 flex-wrap">
                  <li
                      class="page-item"
                      :class="{ disabled: products?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(products.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in products?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === products?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: products?.meta?.current_page === products?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(products.meta.current_page + 1)"
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        class="modal fade"
        id="create"
        tabindex="-1"
        aria-labelledby="createProductLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createProductLabel">{{ isEditMode ? 'Update Product' : 'Create Product' }}</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>
          </div>

          <div class="modal-body text-start">
            <!-- Loader -->
            <div v-show="isLoadingModalData" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <form v-show="!isLoadingModalData" @submit.prevent="handleSubmit">
              <div class="row">
                <div v-for="language in languages" :key="language.id" class="col-12 mb-4">
                  <p class="fw-bold text-primary mb-2">{{ language.title }}</p>

                  <div class="mb-3">
                    <label :for="`title-${language.id}`" class="form-label text-muted">
                      Title <span class="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        :id="`title-${language.id}`"
                        :class="{ 'is-invalid': errors[`titles.${language.iso}`] }"
                        v-model="formData.titles[language.iso]"
                        :placeholder="`Enter title for ${language.title}`"
                    />
                    <div class="invalid-feedback" v-if="errors[`titles.${language.iso}`]">
                      {{ errors[`titles.${language.iso}`] }}
                    </div>
                  </div>

                  <div class="mb-3"
                       :class="{ 'is-invalid': errors[`descriptions.${language.iso}`] }">
                    <label :for="`description-${language.id}`" class="form-label text-muted">
                      Description <span class="text-danger">*</span>
                    </label>
                    <TextEditor
                        v-model="formData.descriptions[language.iso]"
                        :placeholder="`Enter description for ${language.title}`"
                        height="150px"
                    />
                    <div class="invalid-feedback d-block" v-if="errors[`descriptions.${language.iso}`]">
                      {{ errors[`descriptions.${language.iso}`] }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3 select-wrapper">
                    <label for="category-select" class="form-label" :class="{ 'is-invalid': errors.category_id }">
                      Category <span class="text-danger">*</span>
                    </label>
                    <select
                        id="category_id"
                        v-model="formData.category_id"
                        class="choices-select"
                        name="category_id"
                        placeholder="Please select category"
                        :class="{ 'is-invalid': errors.category_id }"
                    >
                      <option value="">Select a category</option>
                      <option  v-for="category in filteredCategories" :key="category.id" :value="category.id">
                        {{ category.title.en }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.category_id">
                      {{ errors.category_id }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="version" class="form-label">
                      Version <span class="text-danger">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        class="form-control"
                        :class="{ 'is-invalid': errors.version }"
                        id="version"
                        v-model="formData.version"
                        placeholder="Enter version"
                        min="0"

                    />
                    <div class="invalid-feedback" v-if="errors.version">
                      {{ errors.version }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                <div class="mb-3">
                  <label for="order" class="form-label">Order</label>
                  <input
                      type="number"
                      class="form-control"
                      id="order"
                      v-model="formData.order"
                      placeholder="Enter order (optional)"
                      min="1"
                  />
                </div>
              </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="last-version-update" class="form-label">Last Version Update</label>
                    <input
                        type="datetime-local"
                        class="form-control"
                        id="last-version-update"
                        v-model="formData.last_version_update_date"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="show-price" class="form-label">Show Price</label>
                    <div class="form-check form-switch">
                      <input
                          class="form-check-input"
                          type="checkbox"
                          id="show-price"
                          v-model="formData.show_price"
                      />
                      <label class="form-check-label" for="show-price">
                        Show price on product page
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Payment Type</label>
                    <div class="form-check">
                      <input
                          class="form-check-input"
                          type="radio"
                          id="payment-type-monthly"
                          :value="true"
                          v-model="formData.payment_type"
                      />
                      <label class="form-check-label" for="payment-type-monthly">
                        Monthly Subscription
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                          class="form-check-input"
                          type="radio"
                          id="payment-type-onetime"
                          :value="false"
                          v-model="formData.payment_type"
                      />
                      <label class="form-check-label" for="payment-type-onetime">
                        One-Time Payment
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="product-image" class="form-label">
                      Image <span v-if="!isEditMode" class="text-danger">*</span>
                    </label>
                    <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        @change="previewImage"
                        :class="{ 'is-invalid': errors.image }"
                        class="form-control"
                    />
                    <div class="invalid-feedback" v-if="errors.image">
                      {{ errors.image }}
                    </div>
                    <div v-if="imagePreview" class="mt-3 text-center">
                      <img :src="imagePreview" alt="Preview" class="img-thumbnail rounded" style="max-width: 300px;" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="video-script" class="form-label">Video Script</label>
                    <TextEditor
                        v-model="formData.video_script"
                        placeholder="Enter video script content..."
                        height="150px"
                    />
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="submit" :disabled="createProduct" class="btn btn-primary" :class="{ 'opacity-50': createProduct }">
                  {{ createProduct ? 'Loading...' : (isEditMode ? 'Update Product' : 'Create Product') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="delete" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete product <strong>{{ productName }}</strong>?</p>
            <p class="text-danger">Warning: This action cannot be undone.</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteProduct"
            >
              {{ isDeleting ? 'Loading...' : 'Yes, Delete' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
  <div v-else class="alert alert-danger mt-3 text-center">
    <slot name="fallback">
      🚫 You do not have permission to view this section.
    </slot>
  </div>
</template>
<script setup>
import {ref, watchEffect, reactive, watch } from 'vue'
import TextEditor from '~/components/TextEditor.vue'

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
definePageMeta({
  layout: 'dashboard',
})
useHead({
  link: [
    {rel: 'stylesheet', href: '/dashboard-assets/css/select2.min.css'},
  ],
  script: [
    {
      src: '/dashboard-assets/js/jquery-3.6.1.min.js',
      type: 'text/javascript'
    },
    {
      src: '/dashboard-assets/js/choices.min.js',
      type: 'text/javascript'
    },
  ]
})
const config = useRuntimeConfig()
const xsrfToken = useCookie('XSRF-TOKEN').value
const isLoadingModalData = ref(false)
const imagePreview = ref(null)
const page = ref(1)
const perPage = ref(15)
const languages = ref(null)
const isLoadingId = ref(null)
const formData = reactive({
  titles: {},
  descriptions: {},
  category_id: '',
  last_version_update_date: '',
  version: '',
  order: '',
  image: null,
  video_script: '',
  show_price: true,
  payment_type: true, // true = Monthly Subscription, false = One-Time Payment
})
const errors = reactive({})
const error = reactive({})
const selectedProductId = ref(null)
const isDeleting = ref(false)
const createProduct = ref(false)
const productName = ref('')
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('product.index') || false
})
const filteredCategories = computed(() => {
  return categories.value?.data?.filter(c => c.parent_id) || [];
});
const choicesInstances = {}

const { data: products, error: errorProduct, pending: isLoadingProducts, refresh: fetchProducts, clear } = useFetch(() => `/products?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})
const { data: categories= ref({ data: [] }), error: errorCategory, pending: isLoadingCategories, refresh: fetchCategories } = useFetch(() => `/categories/all`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})

function setProduct(id) {
  selectedProductId.value = id
  const product = products.value.data.find(p => p.id === id)
  productName.value = product ? product.title.en : 'Unknown Product'
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  
  // Destroy Select2 if it exists
  if (typeof $ !== 'undefined' && $.fn.select2) {
    $('#category-select').select2('destroy')
  }
  createProduct.value = false
  formData.image = null
  imagePreview.value = null
  Object.keys(formData.titles).forEach(key => {
    formData.titles[key] = ''
  })
  Object.keys(formData.descriptions).forEach(key => {
    formData.descriptions[key] = ''
  })
  formData.category_id = ''
  formData.last_version_update_date = ''
  formData.version = ''
  formData.order = ''
  formData.video_script = ''
  formData.show_price = true
  formData.payment_type = true

  // Clear errors
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })

  // Reset file input
  const fileInput = document.getElementById('product-image')
  if (fileInput) fileInput.value = ''
}

async function fetchLanguages() {
  resetData()
  if (languages.value === null) {
    isLoadingModalData.value = true
    try {
      const { data: responseLanguage } = await useFetch('/languages', {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers :{
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
          Accept: 'application/json',
        }
      })

      languages.value = responseLanguage.value.data
      languages.value.forEach(lang => {
        if (!(lang.iso in formData.titles)) {
          formData.titles[lang.iso] = ''
        }
        if (!(lang.iso in formData.descriptions)) {
          formData.descriptions[lang.iso] = ''
        }
      })
    } catch (e) {
      console.error('Error fetching languages:', e)
    } finally {
      isLoadingModalData.value = false
    }
  }
}

function goToPage(newPage) {
  page.value = newPage
  fetchProducts()
}

function previewImage(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imagePreview.value = URL.createObjectURL(file)
    formData.image = file
  } else {
    imagePreview.value = null
  }
}

async function toggleStatus(product) {
  if (isLoadingId.value) return
  isLoadingId.value = product.id
  try {
    const response = await $fetch(`/products/${product.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include',
      headers :{
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
        Accept: 'application/json',
      }
    })
    product.status = !product.status
  } catch (error) {
    console.error('Error toggling status', error)
  } finally {
    isLoadingId.value = null
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])

  languages.value.forEach(lang => {
    if (!formData.titles[lang.iso] || formData.titles[lang.iso].trim() === '') {
      errors[`titles.${lang.iso}`] = `Title (${lang.title}) is required.`
    }
    if (!formData.descriptions[lang.iso] || formData.descriptions[lang.iso].trim() === '') {
      errors[`descriptions.${lang.iso}`] = `Description (${lang.title}) is required.`
    }
  })
  if (!formData.category_id) {
    errors.category_id = 'Category is required.'
  }

  if (!formData.version || formData.version.toString().trim() === '') {
    errors.version = 'Version is required.'
  }

  if (!formData.image && !isEditMode.value) {
    errors.image = 'Image is required.'
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  createProduct.value = true
  const payload = new FormData()
  const title = {}
  const description = {}
  languages.value.forEach(lang => {
    title[lang.iso] = formData.titles[lang.iso] || ''
    description[lang.iso] = formData.descriptions[lang.iso] || ''
  })
  Object.keys(title).forEach(lang => {
    payload.append(`title[${lang}]`, title[lang])
  })
  Object.keys(description).forEach(lang => {
    payload.append(`description[${lang}]`, description[lang])
  })
  payload.append('category_id', formData.category_id)
  payload.append('last_version_update_date', formData.last_version_update_date)
  payload.append('version', formData.version)
  payload.append('order', formData.order)
  payload.append('video_script', formData.video_script)
  payload.append('show_price', formData.show_price ? 1 : 0)
  payload.append('payment_type', formData.payment_type ? 1 : 0)
  if (formData.image instanceof File) {
    payload.append('image', formData.image);
  }
  var response;
  try {
    if (isEditMode.value && formData.id) {
      response= await useFetch(`/products/${formData.id}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

        },
      })


    } else {
      response= await useFetch('/products', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

        },
      })
    }
    if (response?.error?.value) {
      const allErrors = response.error.value?.data?.errors
      if (allErrors && typeof allErrors === 'object') {
        for (const field in allErrors) {
          if (Array.isArray(allErrors[field])) {
            errors[field] = allErrors[field][0]
          }
        }
      } else {
        errors.general = error.value?.data?.message || 'خطایی رخ داده است'
      }
      nuxtApp.$toast({
        title: 'Error!',
        message: response.error.value?.data?.message || 'خطایی رخ داده است',
        type: 'error',
        duration: 3000
      })
      createProduct.value = false
      return
    }

    await fetchProducts()
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Product ${isEditMode.value ? 'updated' : 'created'} successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    closeModalAndResetForm()
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  // Destroy Select2 if it exists
  if (typeof $ !== 'undefined' && $.fn.select2) {
    $('#category-select').select2('destroy')
  }
  
  formData.image = null
  imagePreview.value = null
  Object.keys(formData.titles).forEach(key => {
    formData.titles[key] = ''
  })
  Object.keys(formData.descriptions).forEach(key => {
    formData.descriptions[key] = ''
  })
  formData.category_id = ''
  formData.last_version_update_date = ''
  formData.version = ''
  formData.order = ''
  formData.video_script = ''
  formData.show_price = true
  formData.payment_type = true

  // Clear errors
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentProduct = ref(null)

function openModal(product = null) {
  fetchLanguages()
  initSelect()
  if (product) {
    formData.id = product.id
    isEditMode.value = true
    currentProduct.value = product
    Object.keys(product.title).forEach(lang => {
      formData.titles[lang] = product.title[lang]
    })
    Object.keys(product.description).forEach(lang => {
      formData.descriptions[lang] = product.description[lang]
    })
    formData.category_id = product.category_id
    formData.last_version_update_date = product.last_version_update_date ? new Date(product.last_version_update_date).toISOString().slice(0, 16) : ''
    formData.version = product.version
    formData.order = product.order
    formData.video_script = product.video_script
    formData.show_price = product.show_price
    formData.payment_type = product.payment_type
    if (product.image) {
      imagePreview.value = `${config.public.fileBase}/${product.image}`;
      formData.image = product.image;
    }
  } else {
    isEditMode.value = false
    currentProduct.value = null
  }
  
  // Initialize Select2 after modal is shown
  setTimeout(() => {
    if (typeof $ !== 'undefined' && $.fn.select2) {
      $('#category-select').select2({
        placeholder: 'Select a category',
        allowClear: true,
        width: '100%',
        dropdownParent: $('#create')
      }).on('change', function() {
        formData.category_id = $(this).val()
      })
    }
  }, 300)

}
async function initSelect() {
  await nextTick()
  document.querySelectorAll('.choices-select').forEach((el) => {
    const fieldName = el.getAttribute('name')

    const placeholder = el.getAttribute('placeholder') || 'Please select'

    const existingInstance = choicesInstances[fieldName]
    if (existingInstance && typeof existingInstance.destroy === 'function') {
      existingInstance.destroy()
      delete choicesInstances[fieldName]
      delete el.dataset.choicesInitialized
    }
    if (el.dataset.choicesInitialized === 'true') {
      return // قبلاً برای این عنصر Choices ساخته شده
    }

    if (fieldName && formData[fieldName] !== undefined) {
      el.value = formData[fieldName]
    }

    const instance = new Choices(el, {
      placeholder: true,
      classNames: {
        listDropdown: ['choices__list--dropdown'],
      },
      placeholderValue: placeholder,
      searchEnabled: true,
      itemSelectText: '',
      removeItemButton: true,
    })

    el.dataset.choicesInitialized = 'true'

    if (formData[fieldName]) {
      instance.setChoiceByValue(formData[fieldName].toString())
    }

    choicesInstances[fieldName] = instance
  })
}

async function confirmDeleteProduct() {
  if (!selectedProductId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/products/${selectedProductId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

      },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete product.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'Success!',
      message: 'Product moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchProducts()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
  }
}
</script> 