<!-- pages/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Countries</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Countries</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Countries
          </div>
          <div class="prism-toggle">
            <button
                    class="btn btn-sm btn-success-light mx-1 modal-effect"
                    data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
              Create Country<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/countries/trash" class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingCountries" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!countries?.data || countries.data.length === 0">
            <EmptyState />
          </div>
          <div v-else class="table-responsive">
            <table class="table text-nowrap">
              <thead class="table-primary">
              <tr>
                <th class="col-width-100">#</th>
                <th>English Name</th>
                <th>Abbreviation</th>
                <th>Phone Code</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(country, index) in countries?.data" :key="country.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ country.en }}</td>
                <td>{{ country.abb }}</td>
                <td>{{ country.phone_code || '-' }}</td>
                <td>{{ country.zone?.name || '-' }}</td>
                <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      country.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === country.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(country)"
                        :style="{ pointerEvents: isLoadingId === country.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === country.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ country.status === 1 ? 'Active' : 'Inactive' }}
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
                      <li><a @click="openModal(country)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === country.id }" :style="{ pointerEvents: isLoadingId === country.id ? 'none' : 'auto' }">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCountry(country.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === country.id }" :style="{ pointerEvents: isLoadingId === country.id ? 'none' : 'auto' }">Delete</a></li>
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
                    :class="{ disabled: countries?.meta?.current_page === 1 }"
                >
                  <a
                      class="page-link"
                      href="#"
                      @click.prevent="goToPage(countries.meta.current_page - 1)"
                  >
                    Prev
                  </a>
                </li>
                <li
                    v-for="pageNumber in countries?.meta?.last_page"
                    :key="pageNumber"
                    class="page-item"
                    :class="{ active: pageNumber === countries?.meta?.current_page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: countries?.meta?.current_page === countries?.meta?.last_page }"
                >
                  <a
                      class="page-link text-primary"
                      href="#"
                      @click.prevent="goToPage(countries.meta.current_page + 1)"
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
      aria-labelledby="createCountryLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createCountryLabel">Create Country</h5>
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
                  />
                  <div class="invalid-feedback" v-if="errors['abb']">
                    {{ errors['abb'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="phone_code" class="form-label text-muted">Phone Code</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['phone_code'] }"
                      v-model="phone_code"
                      placeholder="Enter phone code"
                  />
                  <div class="invalid-feedback" v-if="errors['phone_code']">
                    {{ errors['phone_code'] }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="zone_id" class="form-label text-muted">Zone</label>
                  <select
                      class="form-control"
                      :class="{ 'is-invalid': errors['zone_id'] }"
                      v-model="zone_id"
                  >
                    <option value="">Select Zone</option>
                    <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                      {{ zone.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors['zone_id']">
                    {{ errors['zone_id'] }}
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
              <div class="col-md-6 mb-4">
                <div class="mb-2">
                  <label for="flag" class="form-label text-muted">Flag</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors['flag'] }"
                      v-model="flag"
                      placeholder="Enter flag URL or emoji"
                  />
                  <div class="invalid-feedback" v-if="errors['flag']">
                    {{ errors['flag'] }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" :disabled="createCountry" class="btn btn-primary" :class="{ 'opacity-50': createCountry }">
                {{ createCountry ? 'Loading...' : (isEditMode ? 'Update Country' : 'Create Country') }}
              </button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createCountry">Close</button>
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
          <h5 class="modal-title" id="deleteModalLabel">Delete Country</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete country <strong>{{ countryName }}</strong>?</p>
          <p class="text-danger">Warning: Deleting this Country will also delete all its related data.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmDeleteCountry"
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
const isLoadingCountries = ref(false)
const page = ref(1)
const perPage = ref(15)
const countries = ref(null)
const zones = ref([])
const en = ref(null)
const abb = ref(null)
const phone_code = ref(null)
const flag = ref(null)
const zone_id = ref(null)
const currency_id = ref(null)
const fa = ref(null)
const ar = ref(null)
const ku = ref(null)
const tr = ref(null)
const id = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedCountryId = ref(null)
const isDeleting = ref(false)
const createCountry = ref(false)
const countryName = ref('')

function setCountry(id) {
  selectedCountryId.value = id
  const country = countries.value.data.find(c => c.id === id)
  countryName.value = country ? country.en : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  en.value = null
  abb.value = null
  phone_code.value = null
  flag.value = null
  zone_id.value = null
  currency_id.value = null
  fa.value = null
  ar.value = null
  ku.value = null
  tr.value = null
  id.value = null
  isEditMode.value = false
  currentCountry.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

watchEffect(() => {
  fetchCountries()
  fetchZones()
})

async function fetchCountries() {
  error.value = null
  isLoadingCountries.value = true
  try {
    const { data: responseCountry } = await useFetch(`/countries?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    countries.value = responseCountry.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingCountries.value = false
  }
}

async function fetchZones() {
  try {
    const { data: responseZones } = await useFetch('/zones/all', {
      baseURL: config.public.apiBase
    })
    zones.value = responseZones.value || []
  } catch (e) {
    console.error('Error fetching zones:', e)
  }
}

function goToPage(newPage) {
  page.value = newPage
}

async function toggleStatus(country) {
  if (isLoadingId.value) return
  isLoadingId.value = country.id
  try {
    const response = await $fetch(`/countries/${country.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    country.status = country.status === 1 ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!en.value) {
    errors['en'] = 'English name is required.'
  }
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  createCountry.value = true
  const payload = new FormData()
  payload.append('en', en.value)
  payload.append('abb', abb.value || '')
  payload.append('phone_code', phone_code.value || '')
  payload.append('flag', flag.value || '')
  payload.append('zone_id', zone_id.value || '')
  payload.append('currency_id', currency_id.value || '')
  payload.append('fa', fa.value || '')
  payload.append('ar', ar.value || '')
  payload.append('ku', ku.value || '')
  payload.append('tr', tr.value || '')

  try {
    if (isEditMode.value && id.value) {
      await $fetch(`/countries/${id.value}`, {
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
        message: 'Country updated successfully.',
        type: 'success',
        duration: 3000
      })
    } else {
      await useFetch('/countries', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'Country created successfully.',
        type: 'success',
        duration: 3000
      })
    }
    createCountry.value = false
    await fetchCountries()
    closeModalAndResetForm()
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  en.value = null
  abb.value = null
  phone_code.value = null
  flag.value = null
  zone_id.value = null
  currency_id.value = null
  fa.value = null
  ar.value = null
  ku.value = null
  tr.value = null
  id.value = null
  isEditMode.value = false
  currentCountry.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentCountry = ref(null)

function openModal(country = null) {
  if (country) {
    id.value = country.id
    isEditMode.value = true
    currentCountry.value = country
    en.value = country.en
    abb.value = country.abb
    phone_code.value = country.phone_code
    flag.value = country.flag
    zone_id.value = country.zone_id
    currency_id.value = country.currency_id
    fa.value = country.fa
    ar.value = country.ar
    ku.value = country.ku
    tr.value = country.tr
  } else {
    id.value = null
    isEditMode.value = false
    currentCountry.value = null
    en.value = null
    abb.value = null
    phone_code.value = null
    flag.value = null
    zone_id.value = null
    currency_id.value = null
    fa.value = null
    ar.value = null
    ku.value = null
    tr.value = null
  }
}

async function confirmDeleteCountry() {
  if (!selectedCountryId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/countries/${selectedCountryId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete country.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Country moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchCountries()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedCountryId.value = null
  }
}
</script> 