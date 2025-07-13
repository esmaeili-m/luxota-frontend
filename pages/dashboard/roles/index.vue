<!-- pages/index.vue -->
<template>
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
            <button
                    class="btn btn-sm btn-success-light mx-1 modal-effect"
                    data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
              Create Role<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/roles/trash" class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingRoles" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!roles?.data || roles.data.length === 0">
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
              <tr v-for="(role, index) in roles?.data" :key="role.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ role.title }}</td>
                <td>
                    <span
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

                      <li><a @click="openModal(role)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === role.id }" :style="{ pointerEvents: isLoadingId === role.id ? 'none' : 'auto' }">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li v-if="![1, 2].includes(role.id)"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setRole(role.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === role.id }" :style="{ pointerEvents: isLoadingId === role.id ? 'none' : 'auto' }">Delete</a></li>

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
                    :class="{ disabled: roles?.meta?.current_page === 1 }"
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
                    v-for="pageNumber in role?.meta?.last_page"
                    :key="pageNumber"
                    class="page-item"
                    :class="{ active: pageNumber === role?.meta?.current_page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>

                <li
                    class="page-item"
                    :class="{ disabled: role?.meta?.current_page === role?.meta?.last_page }"
                >
                  <a
                      class="page-link text-primary"
                      href="#"
                      @click.prevent="goToPage(role.meta.current_page + 1)"
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
                  <label :for="`title`" class="form-label text-muted">Title</label>
                  <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors[`title`] }"
                      v-model="title"
                      :placeholder="`Enter title `"
                  />
                  <div class="invalid-feedback" v-if="errors[`title`]">
                    {{ errors[`title`] }}
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

</template>
<script setup>
import {ref, watchEffect, reactive } from 'vue'
const nuxtApp = useNuxtApp()
definePageMeta({
  layout: 'dashboard',
})
const config = useRuntimeConfig()
const isLoadingModalData = ref(false)
const isLoadingRoles = ref(false)
const page = ref(1)
const perPage = ref(15)
const roles = ref(null)
const title = ref(null)
const id = ref(null)
const error = reactive({})
const isLoadingId = ref(null)

const errors = reactive({})
const selectedRoleId = ref(null)
const isDeleting = ref(false)
const createRole = ref(false)
function setRole(id) {
  selectedRoleId.value = id
}
function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  title.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
watchEffect(() => {
  fetchRoles()
})
async function fetchRoles() {
  error.value = null
  isLoadingRoles.value = true
  try {
    const { data: responseRole } = await useFetch(`/roles?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    roles.value = responseRole.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingRoles.value = false
  }
}
function goToPage(newPage) {
  page.value = newPage
}
async function toggleStatus(role) {
  if (isLoadingId.value) return
  isLoadingId.value = role.id
  try {
    const response = await $fetch(`/roles/${role.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
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
  if (!title === null) {
    errors[`title`] = `Title is required.`
  }
  return Object.keys(errors).length === 0
}
async function handleSubmit() {
  if (!validateForm()) return
  createRole.value = true
  const payload = new FormData()
  payload.append(`title`, title.value)



  try {
    if (isEditMode.value && id) {
      await $fetch(`/roles/${id.value}`, {
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
        message: 'Role updated successfully.',
        type: 'success',
        duration: 3000
      })

    } else {
      await useFetch('/roles', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'Role created successfully.',
        type: 'success',
        duration: 3000
      })
    }
    createRole.value = false
    await fetchRoles()
    closeModalAndResetForm()
    title.value= null

  } catch (e) {
    console.error('Error sending data:', e)
  }
}
function resetData(){
  title.value= null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
const isEditMode = ref(false)
const currentRole = ref(null)
function openModal(role = null) {
  if (role) {
    id.value = role.id
    isEditMode.value = true
    currentRole.value = role
    title.value = role.title
  } else {
    isEditMode.value = false
    currentRole.value = null
  }
}
async function confirmDeleteRole() {
  if (!selectedRoleId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/roles/${selectedRoleId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
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
    await fetchRoles()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedRoleId.value = null
  }
}
</script>


