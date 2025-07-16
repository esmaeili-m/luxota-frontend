<!-- pages/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Cities</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Cities</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Cities
          </div>
          <div class="prism-toggle">
            <button
                    class="btn btn-sm btn-success-light mx-1 modal-effect"
                    data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
              Create City<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/cities/trash" class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingCities" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!cities?.data || cities.data.length === 0">
            <EmptyState />
          </div>
          <div v-else class="table-responsive">
            <table class="table text-nowrap">
              <thead class="table-primary">
              <tr>
                <th class="col-width-100">#</th>
                <th>English Name</th>
                <th>Abbreviation</th>
                <th>Country</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(city, index) in cities?.data" :key="city.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ city.en }}</td>
                <td>{{ city.abb }}</td>
                <td>{{ city.country?.name || '-' }}</td>
                <td>{{ city.priority }}</td>
                <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      city.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === city.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(city)"
                        :style="{ pointerEvents: isLoadingId === city.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === city.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ city.status === 1 ? 'Active' : 'Inactive' }}
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
                      <li><a @click="openModal(city)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === city.id }" :style="{ pointerEvents: isLoadingId === city.id ? 'none' : 'auto' }">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCity(city.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === city.id }" :style="{ pointerEvents: isLoadingId === city.id ? 'none' : 'auto' }">Delete</a></li>
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
                    :class="{ disabled: cities?.meta?.current_page === 1 }"
                >
                  <a
                      class="page-link"
                      href="#"
                      @click.prevent="goToPage(cities.meta.current_page - 1)"
                  >
                    Prev
                  </a>
                </li>
                <li
                    v-for="pageNumber in cities?.meta?.last_page"
                    :key="pageNumber"
                    class="page-item"
                    :class="{ active: pageNumber === cities?.meta?.current_page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: cities?.meta?.current_page === cities?.meta?.last_page }"
                >
                  <a
                      class="page-link text-primary"
                      href="#"
                      @click.prevent="goToPage(cities.meta.current_page + 1)"
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
      aria-labelledby="createCityLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createCityLabel">Create City</h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-start">
          <div v-if="isLoadingModalData" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <form v-else @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="country_id" class="form-label text-muted">Country</label>
                  <select
                      class="form-control"
                      :class="{ 'is-invalid': errors['country_id'] }"
                      v-model="country_id"
                      required
                  >
                    <option value="">Select Country</option>
                    <option v-for="country in countries" :key="country.id" :value="country.id">
                      {{ country.en || country.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors['country_id']">
                    {{ errors['country_id'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="priority" class="form-label text-muted">Priority</label>
                  <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': errors['priority'] }"
                      v-model="priority"
                      placeholder="Enter priority"
                      min="0"
                      required
                  />
                  <div class="invalid-feedback" v-if="errors['priority']">
                    {{ errors['priority'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="en" class="form-label text-muted">English Name</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['en'] }"
                      v-model="en"
                      placeholder="Enter English name"
                      required
                  />
                  <div class="invalid-feedback" v-if="errors['en']">
                    {{ errors['en'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="abb" class="form-label text-muted">Abbreviation</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['abb'] }"
                      v-model="abb"
                      placeholder="Enter abbreviation"
                      maxlength="10"
                      required
                  />
                  <div class="invalid-feedback" v-if="errors['abb']">
                    {{ errors['abb'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="fa" class="form-label text-muted">Persian Name</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['fa'] }"
                      v-model="fa"
                      placeholder="Enter Persian name"
                  />
                  <div class="invalid-feedback" v-if="errors['fa']">
                    {{ errors['fa'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="ar" class="form-label text-muted">Arabic Name</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['ar'] }"
                      v-model="ar"
                      placeholder="Enter Arabic name"
                  />
                  <div class="invalid-feedback" v-if="errors['ar']">
                    {{ errors['ar'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="ku" class="form-label text-muted">Kurdish Name</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['ku'] }"
                      v-model="ku"
                      placeholder="Enter Kurdish name"
                  />
                  <div class="invalid-feedback" v-if="errors['ku']">
                    {{ errors['ku'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="tr" class="form-label text-muted">Turkish Name</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['tr'] }"
                      v-model="tr"
                      placeholder="Enter Turkish name"
                  />
                  <div class="invalid-feedback" v-if="errors['tr']">
                    {{ errors['tr'] }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" :disabled="createCity" class="btn btn-primary" :class="{ 'opacity-50': createCity }">
                {{ createCity ? 'Loading...' : (isEditMode ? 'Update City' : 'Create City') }}
              </button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createCity">Close</button>
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
          <h5 class="modal-title" id="deleteModalLabel">Delete City</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete city <strong>{{ cityName }}</strong>?</p>
          <p class="text-danger">Warning: Deleting this City will also delete all its related data.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmDeleteCity"
          >
            {{ isDeleting ? 'Loading...' : 'Yes, Delete' }}
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
const isLoadingModalData = ref(false)
const isLoadingCities = ref(false)
const page = ref(1)
const perPage = ref(15)
const cities = ref(null)
const countries = ref([])
const country_id = ref(null)
const en = ref(null)
const abb = ref(null)
const priority = ref(null)
const fa = ref(null)
const ar = ref(null)
const ku = ref(null)
const tr = ref(null)
const id = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedCityId = ref(null)
const isDeleting = ref(false)
const createCity = ref(false)
const cityName = ref('')

function setCity(id) {
  selectedCityId.value = id
  const city = cities.value.data.find(c => c.id === id)
  cityName.value = city ? city.en : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  country_id.value = null
  en.value = null
  abb.value = null
  priority.value = null
  fa.value = null
  ar.value = null
  ku.value = null
  tr.value = null
  id.value = null
  isEditMode.value = false
  currentCity.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

watchEffect(() => {
  fetchCities()
  fetchCountries()
})

async function fetchCities() {
  error.value = null
  isLoadingCities.value = true
  try {
    const { data: responseCity } = await useFetch(`/cities?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    cities.value = responseCity.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingCities.value = false
  }
}

async function fetchCountries() {
  try {
    const { data: responseCountries } = await useFetch('/countries/all', {
      baseURL: config.public.apiBase
    })
    countries.value = responseCountries.value || []
  } catch (e) {
    console.error('Error fetching countries:', e)
  }
}

function goToPage(newPage) {
  page.value = newPage
}

async function toggleStatus(city) {
  if (isLoadingId.value) return
  isLoadingId.value = city.id
  try {
    const response = await $fetch(`/cities/${city.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    city.status = city.status === 1 ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!country_id.value) {
    errors['country_id'] = 'Country is required.'
  }
  if (!en.value) {
    errors['en'] = 'English name is required.'
  }
  if (!abb.value) {
    errors['abb'] = 'Abbreviation is required.'
  }
  if (!priority.value) {
    errors['priority'] = 'Priority is required.'
  }
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  createCity.value = true
  const payload = new FormData()
  payload.append('country_id', country_id.value)
  payload.append('en', en.value)
  payload.append('abb', abb.value)
  payload.append('priority', priority.value)
  payload.append('fa', fa.value || '')
  payload.append('ar', ar.value || '')
  payload.append('ku', ku.value || '')
  payload.append('tr', tr.value || '')

  try {
    if (isEditMode.value && id.value) {
      await $fetch(`/cities/${id.value}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
        }
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'City updated successfully.',
        type: 'success',
        duration: 3000
      })
    } else {
      await useFetch('/cities', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'City created successfully.',
        type: 'success',
        duration: 3000
      })
    }
    createCity.value = false
    await fetchCities()
    closeModalAndResetForm()
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  country_id.value = null
  en.value = null
  abb.value = null
  priority.value = null
  fa.value = null
  ar.value = null
  ku.value = null
  tr.value = null
  id.value = null
  isEditMode.value = false
  currentCity.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentCity = ref(null)

function openModal(city = null) {
  if (city) {
    id.value = city.id
    isEditMode.value = true
    currentCity.value = city
    country_id.value = city.country_id
    en.value = city.en
    abb.value = city.abb
    priority.value = city.priority
    fa.value = city.fa
    ar.value = city.ar
    ku.value = city.ku
    tr.value = city.tr
  } else {
    id.value = null
    isEditMode.value = false
    currentCity.value = null
    country_id.value = null
    en.value = null
    abb.value = null
    priority.value = null
    fa.value = null
    ar.value = null
    ku.value = null
    tr.value = null
  }
}

async function confirmDeleteCity() {
  if (!selectedCityId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/cities/${selectedCityId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete city.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'City moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchCities()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedCityId.value = null
  }
}
</script> 