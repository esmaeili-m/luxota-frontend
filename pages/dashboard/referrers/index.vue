<!-- pages/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Referrers</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Referrers</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Referrers
          </div>
          <div class="prism-toggle">
            <button
                    class="btn btn-sm btn-success-light mx-1 modal-effect"
                    data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
              Create Referrer<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/referrers/trash" class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingReferrers" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!referrers?.data || referrers.data.length === 0">
            <EmptyState />
          </div>
          <div v-else class="table-responsive">
            <table class="table text-nowrap">
              <thead class="table-primary">
              <tr>
                <th class="col-width-100">#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(referrer, index) in referrers?.data" :key="referrer.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ referrer.title }}</td>
                <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      referrer.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === referrer.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(referrer)"
                        :style="{ pointerEvents: isLoadingId === referrer.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === referrer.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ referrer.status === 1 ? 'Active' : 'Inactive' }}
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
                      <li><a @click="openModal(referrer)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === referrer.id }" :style="{ pointerEvents: isLoadingId === referrer.id ? 'none' : 'auto' }">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setReferrer(referrer.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === referrer.id }" :style="{ pointerEvents: isLoadingId === referrer.id ? 'none' : 'auto' }">Delete</a></li>
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
                    :class="{ disabled: referrers?.meta?.current_page === 1 }"
                >
                  <a
                      class="page-link"
                      href="#"
                      @click.prevent="goToPage(referrers.meta.current_page - 1)"
                  >
                    Prev
                  </a>
                </li>
                <li
                    v-for="pageNumber in referrers?.meta?.last_page"
                    :key="pageNumber"
                    class="page-item"
                    :class="{ active: pageNumber === referrers?.meta?.current_page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: referrers?.meta?.current_page === referrers?.meta?.last_page }"
                >
                  <a
                      class="page-link text-primary"
                      href="#"
                      @click.prevent="goToPage(referrers.meta.current_page + 1)"
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
      aria-labelledby="createReferrerLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createReferrerLabel">Create Referrer</h5>
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
            </div>
            <div class="modal-footer">
              <button type="submit" :disabled="createReferrer" class="btn btn-primary" :class="{ 'opacity-50': createReferrer }">
                {{ createReferrer ? 'Loading...' : (isEditMode ? 'Update Referrer' : 'Create Referrer') }}
              </button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createReferrer">Close</button>
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
          <h5 class="modal-title" id="deleteModalLabel">Delete Referrer</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete referrer <strong>{{ referrerName }}</strong>?</p>
          <p class="text-danger">Warning: Deleting this Referrer will also delete all its related data.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmDeleteReferrer"
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
const isLoadingReferrers = ref(false)
const page = ref(1)
const perPage = ref(15)
const referrers = ref(null)
const title = ref(null)
const id = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedReferrerId = ref(null)
const isDeleting = ref(false)
const createReferrer = ref(false)
const referrerName = ref('')

function setReferrer(id) {
  selectedReferrerId.value = id
  const referrer = referrers.value.data.find(r => r.id === id)
  referrerName.value = referrer ? referrer.title : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  title.value = null
  id.value = null
  isEditMode.value = false
  currentReferrer.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

watchEffect(() => {
  fetchReferrers()
})

async function fetchReferrers() {
  error.value = null
  isLoadingReferrers.value = true
  try {
    const { data: responseReferrer } = await useFetch(`/referrers?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    referrers.value = responseReferrer.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingReferrers.value = false
  }
}

function goToPage(newPage) {
  page.value = newPage
}

async function toggleStatus(referrer) {
  if (isLoadingId.value) return
  isLoadingId.value = referrer.id
  try {
    const response = await $fetch(`/referrers/${referrer.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    referrer.status = referrer.status === 1 ? 0 : 1
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
  createReferrer.value = true
  const payload = new FormData()
  payload.append(`title`, title.value)

  try {
    if (isEditMode.value && id.value) {
      await $fetch(`/referrers/${id.value}`, {
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
        message: 'Referrer updated successfully.',
        type: 'success',
        duration: 3000
      })
    } else {
      await useFetch('/referrers', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'Referrer created successfully.',
        type: 'success',
        duration: 3000
      })
    }
    createReferrer.value = false
    await fetchReferrers()
    closeModalAndResetForm()
    title.value = null
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  title.value = null
  id.value = null
  isEditMode.value = false
  currentReferrer.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentReferrer = ref(null)

function openModal(referrer = null) {
  if (referrer) {
    id.value = referrer.id
    isEditMode.value = true
    currentReferrer.value = referrer
    title.value = referrer.title
  } else {
    id.value = null
    isEditMode.value = false
    currentReferrer.value = null
    title.value = null
  }
}

async function confirmDeleteReferrer() {
  if (!selectedReferrerId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/referrers/${selectedReferrerId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete referrer.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Referrer moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchReferrers()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedReferrerId.value = null
  }
}
</script> 