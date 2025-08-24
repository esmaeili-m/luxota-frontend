<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Roles</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">Roles</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Roles
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('role.create')"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create"
                      @click="openModal()">
                Create Role<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
              <NuxtLink v-if="auth.user.permissions.includes('role.trash')" to="/dashboard/roles/trash" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="pending" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!invoices?.data || invoices.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th >Title</th>
                  <th >Status</th>
                  <th >Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(invoice, index) in invoices?.data" :key="invoice.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ invoice.invoice_code }}</td>
                  <td>
                    <span v-if="![1, 2].includes(role.id)"
                          class="badge badge-lg rounded-pill cursor-pointer"
                          :class="[
                      role.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === role.id ? 'opacity-50' : ''
                    ]"
                          @click="() => toggleStatus(role)"
                          :style="{ pointerEvents: isLoadingId === role.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === role.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ role.status === 1 ? 'Active' : 'Inactive' }}
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

                        <li><a v-if="auth.user.permissions.includes('role.update')" @click="openModal(role)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === role.id }" :style="{ pointerEvents: isLoadingId === role.id ? 'none' : 'auto' }" :data-role-id="role.id">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="![1, 2].includes(role.id) && auth.user.permissions.includes('role.delete')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setRole(role.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === role.id }" :style="{ pointerEvents: isLoadingId === role.id ? 'none' : 'auto' }">Delete</a></li>

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
                      :class="{ disabled: roles.meta.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(roles.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in roles?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === roles?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: roles?.meta?.current_page === roles?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(roles.meta.current_page + 1)"
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
        aria-labelledby="createRoleLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createRoleLabel">Create Role</h5>
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
                <div  class="col-12 mb-4">
                  <div class="mb-2">
                    <label :for="`name`" class="form-label text-muted">Name</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors[`name`] }"
                        v-model="name"
                        :placeholder="`Enter Name `"
                    />
                    <div class="invalid-feedback" v-if="errors[`name`]">
                      {{ errors[`name`] }}
                    </div>
                  </div>
                </div>
              </div>


              <div class="modal-footer">
                <button type="submit" :disabled="createRole" class="btn btn-primary" :class="{ 'opacity-50': createRole }">
                  {{ createRole ? 'Loading...' : (isEditMode ? 'Update Role' : 'Create Role') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createRole">Close</button>
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Role</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete role <strong>{{ roleName }}</strong>?</p>
            <p class="text-danger">Warning: Deleting this Role will also delete all its Users.</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteRole"
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
import {ref, watch, reactive, onMounted } from 'vue'
const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('role.index') || false
})
definePageMeta({
  layout: 'dashboard',
  // middleware: ["auth"]

})

const config = useRuntimeConfig()
const isLoadingModalData = ref(false)
const isLoadingRoles = ref(false)
const page = ref(1)
const perPage = ref(15)
const name = ref(null)
const id = ref(null)
// const error = reactive({})
const isLoadingId = ref(null)
const xsrfToken = useCookie('XSRF-TOKEN').value

const errors = reactive({})
const selectedInvoiceId = ref(null)
const isDeleting = ref(false)
const createRole = ref(false)
function setInvoice(id) {
  selectedInvoiceId.value = id
}
const { data: invoices, error, pending, refresh, clear } = useFetch(() => `/invoices?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken.value || ''),
    Accept: 'application/json',

  }
})
function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  createRole.value = false

  name.value = null
  id.value = null
  isEditMode.value = false
  currentRole.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

function goToPage(newPage) {
  page.value = newPage
  refresh()
}
async function toggleStatus(role) {
  if (isLoadingId.value) return
  isLoadingId.value = role.id
  try {
    const response = await $fetch(`/roles/${role.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'POST',
      headers:{
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        'Accept': 'application/json',

      }
    })
    role.status = role.status  === 1  ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}
function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!name.value || name.value.trim() === '') {
    errors[`name`] = `Name is required.`
  }
  return Object.keys(errors).length === 0
}
async function handleSubmit() {
  if (!validateForm()) return
  createRole.value = true
  const payload = new FormData()
  payload.append(`name`, name.value)
  try {
    if (isEditMode.value && id) {
      const { data, error  } = await useFetch(`/roles/${id.value}`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
        baseURL: config.public.apiBase,
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
        },
      })
    } else {
      const { data, error } = await useFetch('/roles', {
        method: 'POST',
        body: payload,
        credentials: 'include',
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        },
      })
    }
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Role ${isEditMode.value ? 'updated' : 'created' } successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    await refresh()
    closeModalAndResetForm()

  } catch (e) {
    console.error('Error sending data:', e)
  }
}
function resetData(){
  name.value= null
  isEditMode.value = false
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
const isEditMode = ref(false)
const currentRole = ref(null)
function openModal(role = null) {
  // Reset form data first
  name.value = null
  id.value = null
  isEditMode.value = false
  currentRole.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })

  if (role) {
    id.value = role.id
    isEditMode.value = true
    currentRole.value = role
    name.value = role.name
  }
}
async function confirmDeleteRole() {
  if (!selectedInvoiceId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/roles/${selectedInvoiceId.value}`, {
      method: 'DELETE',
      credentials: 'include',
      baseURL: config.public.apiBase,
      headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
      },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete role.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Role moved to trash.',
      type: 'success',
      duration: 3000
    })
    await refresh()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedInvoiceId.value = null
  }
}
</script>


