<!-- pages/trash.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Cities Trash</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <NuxtLink to="/dashboard/cities">Cities</NuxtLink>
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
            Deleted Cities
          </div>
          <div class="prism-toggle">
            <NuxtLink to="/dashboard/cities" class="btn btn-sm btn-primary-light">
              Back to Cities<i class="ri-arrow-left-line ms-2 d-inline-block align-middle"></i>
            </NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingCities" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!cities || cities.length === 0">
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
                <th>Deleted At</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(city, index) in cities" :key="city.id">
                <td>{{ index + 1 }}</td>
                <td>{{ city.en }}</td>
                <td>{{ city.abb }}</td>
                <td>{{ city.country?.name || '-' }}</td>
                <td>{{ city.priority }}</td>
                <td>{{ formatDate(city.deleted_at) }}</td>
                <td>
                  <div class="btn-group my-1">
                    <button type="button" class="btn btn-sm btn-light">...</button>
                    <button type="button"
                            class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split me-2"
                            data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a @click="restoreCity(city.id)" class="dropdown-item" :class="{ 'disabled': isLoadingId === city.id }" :style="{ pointerEvents: isLoadingId === city.id ? 'none' : 'auto' }">Restore</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCity(city.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === city.id }" :style="{ pointerEvents: isLoadingId === city.id ? 'none' : 'auto' }">Permanently Delete</a></li>
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
          <h5 class="modal-title" id="deleteModalLabel">Permanently Delete City</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to permanently delete city <strong>{{ cityName }}</strong>?</p>
          <p class="text-danger">Warning: This action cannot be undone. All data will be permanently lost.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmPermanentlyDeleteCity"
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
const isLoadingCities = ref(false)
const cities = ref([])
const error = reactive({})
const isLoadingId = ref(null)
const selectedCityId = ref(null)
const isDeleting = ref(false)
const cityName = ref('')

function setCity(id) {
  selectedCityId.value = id
  const city = cities.value.find(c => c.id === id)
  cityName.value = city ? city.en : ''
}

watchEffect(() => {
  fetchTrashedCities()
})

async function fetchTrashedCities() {
  error.value = null
  isLoadingCities.value = true
  try {
    const { data: responseCity } = await useFetch('/cities/trash', {
      baseURL: config.public.apiBase
    })
    cities.value = responseCity.value || []
  } catch (e) {
    error.value = e
  } finally {
    isLoadingCities.value = false
  }
}

async function restoreCity(cityId) {
  if (isLoadingId.value) return
  isLoadingId.value = cityId
  try {
    await $fetch(`/cities/${cityId}/restore`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    nuxtApp.$toast({
      title: 'success!',
      message: 'City restored successfully.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedCities()
  } catch (error) {
    console.error('خطا در بازگردانی', error)
    nuxtApp.$toast({
      title: 'error!',
      message: 'Failed to restore city.',
      type: 'error',
      duration: 3000
    })
  } finally {
    isLoadingId.value = null
  }
}

async function confirmPermanentlyDeleteCity() {
  if (!selectedCityId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/cities/force-delete/${selectedCityId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to permanently delete city.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'City permanently deleted.',
      type: 'success',
      duration: 3000
    })
    await fetchTrashedCities()
  } catch (e) {
    console.error(e)
    alert('An error occurred during permanent deletion.')
  } finally {
    isDeleting.value = false
    selectedCityId.value = null
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 