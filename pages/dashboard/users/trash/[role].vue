<!-- pages/dashboard/users/trash.vue -->
<template>
  <div  v-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Trash - Users</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              <NuxtLink :to="`/dashboard/users/${$route.params.role}`">Users</NuxtLink>
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
              Deleted Users
            </div>
            <div class="prism-toggle">
              <NuxtLink :to="`/dashboard/users/${$route.params.role}`" class="btn btn-sm btn-primary-light">
                Back to Users<i class="ri-arrow-left-line ms-2 d-inline-block align-middle"></i>
              </NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingUsers" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!users?.data || users.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-warning">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Deleted At</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, index) in users?.data" :key="user.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-sm me-2">
                        <img  :src="user.avatar ? `${config.public.fileBase}/${user.avatar}` : '/dashboard-assets/images/authentication/user.png'"
                              class="rounded"
                              alt="Avatar">
                      </div>
                      <div>
                        <div class="fw-semibold">{{ user.name }}</div>
                        <small class="text-muted">{{ user.rank?.title }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>
                    <span class="badge bg-info-transparent">{{ user.role?.name }}</span>
                  </td>
                  <td>
                    <span class="text-muted">{{ formatDate(user.deleted_at) }}</span>
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
                        <li>
                          <a  v-if="auth.user.permissions.includes('user.restore')"
                              @click="restoreUser(user.id)"
                              class="dropdown-item cursor-pointer"
                              :class="{ 'disabled': isLoadingId === user.id }"
                              :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }">
                            Restore
                          </a>
                        </li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li>
                          <a  v-if="auth.user.permissions.includes('user.delete')"
                              data-bs-toggle="modal"
                              data-bs-effect="effect-flip-vertical"
                              data-bs-target="#forceDelete"
                              @click="setUser(user.id, user.name)"
                              class="dropdown-item modal-effect"
                              href="#forceDelete"
                              :class="{ 'disabled': isLoadingId === user.id }"
                              :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }">
                            Force Delete
                          </a>
                        </li>
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
                      :class="{ disabled: users?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(users.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in users?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === users?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: users?.meta?.current_page === users?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(users.meta.current_page + 1)"
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

    <!-- Force Delete Modal -->
    <div class="modal fade" id="forceDelete" tabindex="-1" aria-labelledby="forceDelete" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forceDeleteModalLabel">Force Delete User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="alert alert-danger">
              <i class="ri-error-warning-line me-2"></i>
              <strong>Warning:</strong> This action cannot be undone!
            </div>
            <p>Are you sure you want to permanently delete user <strong>{{ userName }}</strong>?</p>
            <p class="text-danger">This will permanently remove the user and all associated data from the database.</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isForceDeleting">Cancel</button>
            <button
                :disabled="isForceDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isForceDeleting }"
                @click="confirmForceDeleteUser"
            >
              {{ isForceDeleting ? 'Loading...' : 'Yes, Permanently Delete' }}
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
import { ref, watchEffect, reactive, onMounted } from 'vue'
import {useRoute} from "vue-router";
const auth = useAuthStore()
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('user.trash') || false
})
const nuxtApp = useNuxtApp()
definePageMeta({
  layout: 'dashboard',
})
const route = useRoute()
const config = useRuntimeConfig()

// Reactive data
const page = ref(1)
const perPage = ref(15)
const isForceDeleting = ref(false)
const selectedUserId = ref(null)
const isLoadingId  = ref(null)
const userName = ref('')
const xsrfToken = useCookie('XSRF-TOKEN').value

// Methods
function setUser(id, name) {
  selectedUserId.value = id
  userName.value = name
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const { data: users, error, pending: isLoadingUsers, refresh: fetchUsers, } = await useAsyncData(
    'users-trash',
    () => $fetch(`/users/trash?page=${page.value}`, {
      baseURL: config.public.apiBase,
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken.value),
        Accept: 'application/json',
      },
    })
)

function goToPage(newPage) {
  page.value = newPage
}

async function restoreUser(userId) {
  if (isLoadingId.value) return
  isLoadingId.value = userId

  try {
    await $fetch(`/users/${userId}/restore`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        Accept: 'application/json',
      },
      credentials: 'include'
    })

    nuxtApp.$toast({
      title: 'Success!',
      message: 'User restored successfully.',
      type: 'success',
      duration: 3000
    })

    await fetchUsers()
  } catch (error) {
    console.error('Error restoring user:', error)
    nuxtApp.$toast({
      title: 'Error!',
      message: 'Failed to restore user.',
      type: 'error',
      duration: 3000
    })
  } finally {
    isLoadingId.value = null
  }
}

async function confirmForceDeleteUser() {
  if (!selectedUserId.value) return

  isForceDeleting.value = true
  try {
    await $fetch(`/users/force-delete/${selectedUserId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        Accept: 'application/json',
      },
      credentials: 'include'

    })

    const modalEl = document.getElementById('forceDelete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    nuxtApp.$toast({
      title: 'Success!',
      message: 'User permanently deleted.',
      type: 'success',
      duration: 3000
    })

    await fetchUsers()
  } catch (e) {
    console.error(e)
    nuxtApp.$toast({
      title: 'Error!',
      message: 'Failed to delete user.',
      type: 'error',
      duration: 3000
    })
  } finally {
    isForceDeleting.value = false
    selectedUserId.value = null
    userName.value = ''
  }
}




</script>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-weight: bold;
  font-size: 14px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>