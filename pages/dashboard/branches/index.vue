<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Branches</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">Branches</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Branches
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('branch.create')"
                  @click="openModal()"
                  class="btn btn-sm btn-success-light mx-1 modal-effect"
                  data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
                Create Branch<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
              <NuxtLink v-if="auth.user.permissions.includes('branch.trash')" to="/dashboard/branches/trash" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingBranches" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!branches?.data || branches.data.length === 0">
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
                <tr v-for="(branch, index) in branches?.data" :key="branch.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ branch.title }}</td>
                  <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      branch.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === branch.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(branch)"
                        :style="{ pointerEvents: isLoadingId === branch.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === branch.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ branch.status === 1 ? 'Active' : 'Inactive' }}
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
                        <li v-if="auth.user.permissions.includes('branch.update')"><a @click="openModal(branch)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === branch.id }" :style="{ pointerEvents: isLoadingId === branch.id ? 'none' : 'auto' }">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('branch.delete')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setBranch(branch.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === branch.id }" :style="{ pointerEvents: isLoadingId === branch.id ? 'none' : 'auto' }">Delete</a></li>
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
                      :class="{ disabled: branches?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(branches.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>
                  <li
                      v-for="pageNumber in branches?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === branches?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>
                  <li
                      class="page-item"
                      :class="{ disabled: branches?.meta?.current_page === branches?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(branches.meta.current_page + 1)"
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
        aria-labelledby="createBranchLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createBranchLabel">Create Branch</h5>
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
                <button type="submit" :disabled="createBranch" class="btn btn-primary" :class="{ 'opacity-50': createBranch }">
                  {{ createBranch ? 'Loading...' : (isEditMode ? 'Update Branch' : 'Create Branch') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createBranch">Close</button>
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Branch</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete branch <strong>{{ branchName }}</strong>?</p>
            <p class="text-danger">Warning: Deleting this Branch will also delete all its related data.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteBranch"
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
const xsrfToken = useCookie('XSRF-TOKEN').value

definePageMeta({
  layout: 'dashboard',
})
const config = useRuntimeConfig()
const isLoadingModalData = ref(false)
const page = ref(1)
const perPage = ref(15)
const title = ref(null)
const id = ref(null)
const isLoadingId = ref(null)
const errors = reactive({})
const selectedBranchId = ref(null)
const isDeleting = ref(false)
const createBranch = ref(false)
const branchName = ref('')
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('branch.index') || false
})
const { data: branches, error, pending: isLoadingBranches, refresh: fetchBranches, clear } = useFetch(() => `/branches?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})

function setBranch(id) {
  selectedBranchId.value = id
  const branch = branches.value.data.find(b => b.id === id)
  branchName.value = branch ? branch.title : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  title.value = null
  id.value = null
  createBranch.value = false
  isEditMode.value = false
  currentBranch.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

function goToPage(newPage) {
  page.value = newPage
  fetchBranches()
}

async function toggleStatus(branch) {
  if (isLoadingId.value) return
  isLoadingId.value = branch.id
  try {
    const response = await $fetch(`/branches/${branch.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
      }
    })
    branch.status = branch.status === 1 ? 0 : 1
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
  createBranch.value = true
  const payload = new FormData()
  payload.append(`title`, title.value)
  var response

  try {
    if (isEditMode.value && id.value) {
      response= await useFetch(`/branches/${id.value}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

        }
      })

    } else {

      response= await useFetch('/branches', {
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
      createBranch.value = false
      return
    }
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Role ${isEditMode.value ? 'updated' : 'created'} successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    await fetchBranches()
    closeModalAndResetForm()
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  title.value = null
  id.value = null
  isEditMode.value = false
  currentBranch.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentBranch = ref(null)

function openModal(branch = null) {
  if (branch) {
    id.value = branch.id
    isEditMode.value = true
    currentBranch.value = branch
    title.value = branch.title
  } else {
    id.value = null
    isEditMode.value = false
    currentBranch.value = null
    title.value = null
  }
}

async function confirmDeleteBranch() {
  if (!selectedBranchId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/branches/${selectedBranchId.value}`, {
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
      alert('Failed to delete branch.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Branch moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchBranches()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedBranchId.value = null
  }
}
</script> 