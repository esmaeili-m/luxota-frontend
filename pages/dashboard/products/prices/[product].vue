<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">product prices
      </h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><nuxt-link to="/dashboard/products">Products</nuxt-link></li>
            <li class="breadcrumb-item active" aria-current="page">{{product?.data?.title?.en}} Prices</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              {{product?.data?.title?.en}} product prices
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('category.create')" @click="openModal()"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
                Set Price<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingPrices" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!prices?.data || prices.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th >Zone</th>
                  <th >Price</th>
                  <th >Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(price, index) in prices?.data" :key="price.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ price.zone.title }}</td>
                  <td>{{ price.price }}</td>

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
                          <a @click="openModal(price)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" >Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('product.price')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCategory(price.id)" class="dropdown-item modal-effect" href="#delete" >Delete</a></li>

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
                      :class="{ disabled: prices?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(categories.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in categories?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === categories?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: prices?.meta?.current_page === prices?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(categories.meta.current_page + 1)"
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
        aria-labelledby="setPriceLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="setPriceLabel">Set Price</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"

                aria-label="Close"
            ></button>
          </div>

          <div class="modal-body text-start">
            <!-- Loader -->
            <div v-if="isLoadingModalData" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <form v-else @submit.prevent="handleSubmit">


              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="category-order" class="form-label">Price</label>
                    <input
                        type="number"
                        step="any"
                        class="form-control"
                        :class="{ 'is-invalid': errors.price }"
                        id="price-product"
                        v-model="form.price"
                        placeholder="Enter Price Product"
                        min="1"
                    />
                    <div class="invalid-feedback" v-if="errors.price">
                      {{ errors.order }}
                    </div>
                  </div>
                </div>
                <div  class="col-md-6 mb-3 select-wrapper">
                  <label class="form-label text-muted " :class="{ 'is-invalid': errors.zone_id }">Zone *</label>
                  <div class="card-body">
                    <select
                        :disabled="isEditMode"
                        name="zone_id"
                        v-model="form.zone_id"
                        placeholder="Please Select Zone"
                        class="form-control choices-select"
                    >
                      <option v-for="(zone, zoneKey) in zones" :key="zone.id" :value="zone.id">
                        {{ zone.title }}
                      </option>
                    </select>
                  </div>
                  <div class="invalid-feedback" v-if="errors.zone_id">
                    {{ errors.zone_id }}
                  </div>

                </div>
              </div>

              <div class="modal-footer">
                <button type="submit" :disabled="setPrice" class="btn btn-primary" :class="{ 'opacity-50': setPrice }">
                  {{ setPrice ? 'Loading...' : (isEditMode ? 'Update Price' : 'Set Price') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="setPrice">Close</button>
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Price</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete Price?</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeletePrice"
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
import {ref, reactive } from 'vue'
import {useRoute} from "vue-router";
const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const route = useRoute()
const config = useRuntimeConfig()
const xsrfToken = useCookie('XSRF-TOKEN').value
definePageMeta({
  layout: 'dashboard',
})
const isLoadingModalData = ref(false)
const imagePreview = ref(null)
const page = ref(1)
const perPage = ref(15)
const languages = ref(null)
const isLoadingId = ref(null)
const form = reactive({
  price: null,
  zone_id: null,
})
const errors = reactive({})
const selectedId = ref(null)
const isDeleting = ref(false)
const setPrice = ref(false)
const isEditMode = ref(false)
const currentCategory = ref(null)
const choicesInstances = {}
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('category.index') || false
})
const { data: prices, error, pending: isLoadingPrices, refresh: fetchPrices, clear } = useFetch(() => `/prices/${route.params.product}?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  key: `prices-page-${page.value}`,
  cache: 'no-cache',
  server: false,
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})
const  zones=ref([])
const { data: product, error: productError, pending: isLoadingProducts, refresh: fetchProduct } = useFetch(() => `/products/${route.params.product}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  key: `productt`,
  cache: 'no-cache',
  server: false,
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})
async function fetchZone() {
  const { data, error} = await useFetch('/zones/all', {
    baseURL: config.public.apiBase,
    credentials: 'include',
    server: false,
    headers: {
      'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
      Accept: 'application/json',
    }
  })
  if (error.value) {
    console.error('خطا در گرفتن زون‌ها:', error.value)
    return
  }
  zones.value=data.value.data
}

function setCategory(id) {
  selectedId.value = id
}
function remove_choice_value() {
  Object.entries(choicesInstances).forEach(([key, instance]) => {
    if (
        instance &&
        typeof instance.removeActiveItems === 'function' &&
        instance.containerOuter // اختیاری اما مفیده
    ) {
      instance.removeActiveItems()
    }
  })
}
function closeModalAndResetForm() {
  remove_choice_value()
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
  resetData()

}
function goToPage(newPage) {
  page.value = newPage
  fetchPrices()
}
function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!form.price) {
    errors.price = 'Price is required.'
  }
  if (!form.zone_id) {
    errors.zone_id = 'Zone is required.'
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  setPrice.value = true
  const payload = new FormData()
  if (form.price) {
    payload.append('price', form.price);
  }
  if (form.zone_id) {
    payload.append('zone_id', form.zone_id);
  }

  payload.append('product_id', route.params.product);
  var response
  try {
      response= await useFetch('/prices', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

        }
      })
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
      setPrice.value = false
      return
    }
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Price ${isEditMode.value ? 'updated' : 'set'} successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    await fetchPrices()
    closeModalAndResetForm()

  } catch (e) {
    console.error('Error sending data:', e)
  }
}
function resetData(){
  form.price = null
  form.zone_id = null
  setPrice.value = false
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
async function openModal(price = null) {
  await fetchZone()
  remove_choice_value()
  if (price) {
    isEditMode.value = true
    form.price = price.price
    form.zone_id = price.zone_id
  } else {
    isEditMode.value = false
    form.price = null
    form.zone_id = null
  }
  initSelect()

}
async function confirmDeletePrice() {
  if (!selectedId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/prices/${selectedId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

      }
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete category.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Price moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchPrices()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedId.value = null
  }
}
async function initSelect() {
  await nextTick()
  document.querySelectorAll('.choices-select').forEach((el) =>  {
    const fieldName = el.getAttribute('name')
    const placeholder = el.getAttribute('placeholder') || 'Please select'
    const existingInstance = choicesInstances[fieldName]
    if (existingInstance && typeof existingInstance.destroy === 'function') {
      existingInstance.destroy()
      delete choicesInstances[fieldName]

      // پاک کردن flag تا امکان init دوباره باشه
      delete el.dataset.choicesInitialized
    }

    if (el.dataset.choicesInitialized === 'true') {
      return // قبلاً برای این عنصر Choices ساخته شده
    }

    if (fieldName && form[fieldName] !== undefined) {
      el.value = form[fieldName]
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
    if (el.disabled){
      instance.disable()
    }

    el.dataset.choicesInitialized = 'true'

    // مقداردهی اولیه
    if (form[fieldName]) {
      instance.setChoiceByValue(form[fieldName].toString())
    }

    // ذخیره instance
    choicesInstances[fieldName] = instance
  })
}

</script>


