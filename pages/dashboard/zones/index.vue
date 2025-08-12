<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div  v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Zones</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">Zones</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Zones
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('zone.create')" @click="openModal()"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
                Create Zone<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
              <NuxtLink v-if="auth.user.permissions.includes('zone.trash')" to="/dashboard/zones/trash" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingZones" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!zones?.data || zones.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(zone, index) in zones?.data" :key="zone.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ zone.title }}</td>
                  <td>{{ zone.description || '-' }}</td>
                  <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      zone.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === zone.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(zone)"
                        :style="{ pointerEvents: isLoadingId === zone.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === zone.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ zone.status === 1 ? 'Active' : 'Inactive' }}
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
                        <li v-if="auth.user.permissions.includes('zone.update')" ><a @click="openModal(zone)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === zone.id }" :style="{ pointerEvents: isLoadingId === zone.id ? 'none' : 'auto' }">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('zone.delete')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setZone(zone.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === zone.id }" :style="{ pointerEvents: isLoadingId === zone.id ? 'none' : 'auto' }">Delete</a></li>
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
                      :class="{ disabled: zones?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(zones.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>
                  <li
                      v-for="pageNumber in zones?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === zones?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>
                  <li
                      class="page-item"
                      :class="{ disabled: zones?.meta?.current_page === zones?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(zones.meta.current_page + 1)"
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
        aria-labelledby="createZoneLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createZoneLabel">Create Zone</h5>
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
                <div class="col-12 mb-4">
                  <div class="mb-2">
                    <label :for="`title`" class="form-label text-muted">Title</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors[`title`] }"
                        v-model="title"
                        :placeholder="`Enter title`"
                    />
                    <div class="invalid-feedback" v-if="errors[`title`]">
                      {{ errors[`title`] }}
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-4">
                  <div class="mb-2">
                    <label :for="`description`" class="form-label text-muted">Description</label>
                    <textarea
                        class="form-control"
                        :class="{ 'is-invalid': errors[`description`] }"
                        v-model="description"
                        :placeholder="`Enter description`"
                        rows="3"
                    ></textarea>
                    <div class="invalid-feedback" v-if="errors[`description`]">
                      {{ errors[`description`] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" :disabled="createZone" class="btn btn-primary" :class="{ 'opacity-50': createZone }">
                  {{ createZone ? 'Loading...' : (isEditMode ? 'Update Zone' : 'Create Zone') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createZone">Close</button>
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Zone</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete zone <strong>{{ zoneName }}</strong>?</p>
            <p class="text-danger">Warning: Deleting this Zone will also delete all its related data.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteZone"
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
import {ref, watchEffect, reactive } from 'vue'
const nuxtApp = useNuxtApp()
const auth = useAuthStore()
definePageMeta({
  layout: 'dashboard',
})
const xsrfToken = useCookie('XSRF-TOKEN').value
const config = useRuntimeConfig()
const isLoadingModalData = ref(false)
const page = ref(1)
const perPage = ref(15)
const title = ref(null)
const description = ref(null)
const id = ref(null)
const isLoadingId = ref(null)
const errors = reactive({})
const selectedZoneId = ref(null)
const isDeleting = ref(false)
const createZone = ref(false)
const zoneName = ref('')
const isEditMode = ref(false)
const currentZone = ref(null)
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('zone.index') || false
})

function setZone(id) {
  selectedZoneId.value = id
  const zone = zones.value.data.find(z => z.id === id)
  zoneName.value = zone ? zone.title : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  title.value = null
  description.value = null
  id.value = null
  isEditMode.value = false
  currentZone.value = null
  createZone.value = false

  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const { data: zones, error, pending: isLoadingZones, refresh: fetchZones, clear } = useFetch(() => `/zones?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})

function goToPage(newPage) {
  page.value = newPage
  fetchZones()
}

async function toggleStatus(zone) {
  if (isLoadingId.value) return
  isLoadingId.value = zone.id
  try {
    const response = await $fetch(`/zones/${zone.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include',
      headers :{
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
        Accept: 'application/json',
      }
    })
    zone.status = zone.status === 1 ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!title.value) {
    errors[`title`] = `Title is required.`
  }
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  createZone.value = true
  const payload = new FormData()
  payload.append(`title`, title.value)
  payload.append(`description`, description.value || '')
  var response;
  try {
    let response
    if (isEditMode.value && id.value) {
      response = await useFetch(`/zones/${id.value}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        }
      })
    } else {
      response = await useFetch('/zones', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        },
      })
    }
    if (response.error.value) {
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
      createZone.value = false
      return
    }
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Role ${isEditMode.value ? 'updated' : 'created'} successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    await fetchZones()
    closeModalAndResetForm()

  } catch (e) {

    console.error('Error sending data:', e)
  }
}

function resetData(){
  title.value = null
  description.value = null
  id.value = null
  isEditMode.value = false
  currentZone.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

function openModal(zone = null) {
  if (errors && typeof errors === 'object') {
    Object.keys(errors).forEach(key => delete errors[key])
  }
  if (zone) {
    id.value = zone.id
    isEditMode.value = true
    currentZone.value = zone
    title.value = zone.title
    description.value = zone.description
  } else {
    id.value = null
    isEditMode.value = false
    currentZone.value = null
    title.value = null
    description.value = null
  }
}

async function confirmDeleteZone() {
  if (!selectedZoneId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/zones/${selectedZoneId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
        Accept: 'application/json'
      },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete zone.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Zone moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchZones()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedZoneId.value = null
  }
}
</script>
