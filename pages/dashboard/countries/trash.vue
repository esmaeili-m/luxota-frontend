<!-- pages/trash.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Countries Trash</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <NuxtLink to="/dashboard/countries">Countries</NuxtLink>
          </li>
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
            Deleted Countries
          </div>
          <div class="prism-toggle">
            <NuxtLink to="/dashboard/countries" class="btn btn-sm btn-primary-light">
              Back to Countries<i class="ri-arrow-left-line ms-2 d-inline-block align-middle"></i>
            </NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingCountries" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!countries || countries.length === 0">
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
                <th>Deleted At</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(country, index) in countries" :key="country.id">
                <td>{{ index + 1 }}</td>
                <td>{{ country.en }}</td>
                <td>{{ country.abb }}</td>
                <td>{{ country.phone_code || '-' }}</td>
                <td>{{ country.zone?.name || '-' }}</td>
                <td>{{ formatDate(country.deleted_at) }}</td>
                <td>
                  <div class="btn-group my-1">
                    <button type="button" class="btn btn-sm btn-light">...</button>
                    <button type="button"
                            class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split me-2"
                            data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a @click="restoreCountry(country.id)" class="dropdown-item" :class="{ 'disabled': isLoadingId === country.id }" :style="{ pointerEvents: isLoadingId === country.id ? 'none' : 'auto' }">Restore</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCountry(country.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === country.id }" :style="{ pointerEvents: isLoadingId === country.id ? 'none' : 'auto' }">Permanently Delete</a></li>
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
  <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="delete" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Permanently Delete Country</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to permanently delete country <strong>{{ countryName }}</strong>?</p>
          <p class="text-danger">Warning: This action cannot be undone. All data will be permanently lost.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmPermanentlyDeleteCountry"
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
const isLoadingCountries = ref(false)
const countries = ref([])
const error = reactive({})
const isLoadingId = ref(null)
const selectedCountryId = ref(null)
const isDeleting = ref(false)
const countryName = ref('')

function setCountry(id) {
  selectedCountryId.value = id
  const country = countries.value.find(c => c.id === id)
  countryName.value = country ? country.en : ''
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

watchEffect(() => {
  fetchTrashedCountries()
})

async function fetchTrashedCountries() {
  error.value = null
  isLoadingCountries.value = true
  try {
    const { data: responseCountry } = await useFetch('/countries/trash', {
      baseURL: config.public.apiBase
    })
    countries.value = responseCountry.value || []
  } catch (e) {
    error.value = e
  } finally {
    isLoadingCountries.value = false
  }
}

async function restoreCountry(countryId) {
  if (isLoadingId.value) return
  isLoadingId.value = countryId
  try {
    await $fetch(`/countries/${countryId}/restore`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    nuxtApp.$toast({
      title: 'success!',
      message: 'Country restored successfully.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedCountries()
  } catch (error) {
    console.error('خطا در بازگردانی', error)
    nuxtApp.$toast({
      title: 'error!',
      message: 'Failed to restore country.',
      type: 'error',
      duration: 3000
    })
  } finally {
    isLoadingId.value = null
  }
}

async function confirmPermanentlyDeleteCountry() {
  if (!selectedCountryId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/countries/force-delete/${selectedCountryId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to permanently delete country.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Country permanently deleted.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedCountries()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedCountryId.value = null
  }
}
</script> 