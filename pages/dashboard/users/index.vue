<!-- pages/dashboard/users/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Users</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Users</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Users
          </div>
          <div class="prism-toggle">
            <button
              class="btn btn-sm btn-success-light mx-1 modal-effect"
              data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create"
              @click="openModal()">
              Create User<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/users/trash" class="btn btn-sm btn-warning-light">Trash<i
              class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">


          <!-- Search and Filter Section -->
          <div class="row mb-3">
            <div class="col-md-3">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery.name"
                placeholder="Search by name..."
                @input="debounceSearch"
              />
            </div>
            <div class="col-md-3">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery.email"
                placeholder="Search by email..."
                @input="debounceSearch"
              />
            </div>

            <div class="col-md-2">

              <select class="form-select" v-model="searchQuery.status" @change="debounceSearch">
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select " v-model="searchQuery.role_id" @change="debounceSearch">
                <option value="">All Roles</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.title }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary" @click="clearSearch">Clear</button>
            </div>
          </div>

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
              <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Zone</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users?.data" :key="user.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-sm me-2">
                        <img v-if="user.avatar" :src="user.avatar" class="rounded-circle" alt="Avatar">
                        <div v-else class="avatar-initials rounded-circle bg-primary text-white">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
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
                    <span class="badge bg-info-transparent">{{ user.role?.title }}</span>
                  </td>
                  <td>{{ user.zone?.name }}</td>
                  <td>{{ user.city?.name }}</td>
                  <td>
                    <span
                      class="badge badge-lg rounded-pill cursor-pointer"
                      :class="[
                        user.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                        isLoadingId === user.id ? 'opacity-50' : ''
                      ]"
                      @click="() => toggleStatus(user)"
                      :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }"
                    >
                      <template v-if="isLoadingId === user.id">
                        Loading...
                      </template>
                      <template v-else>
                        {{ user.status === 1 ? 'Active' : 'Inactive' }}
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
                        <li><a @click="openModal(user)"
                          data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === user.id }" :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }" :data-user-id="user.id">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="![1].includes(user.id)"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete" @click="setUser(user.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === user.id }" :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }">Delete</a></li>
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

  <!-- Create/Edit Modal -->
  <div
    class="modal fade"
    id="create"
    tabindex="-1"
    aria-labelledby="createUserLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createUserLabel">{{ isEditMode ? 'Update User' : 'Create User' }}</h5>
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
              <!-- Basic Information -->
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Name *</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  v-model="form.name"
                  placeholder="Enter name"
                />
                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Email *</label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  v-model="form.email"
                  placeholder="Enter email"
                />
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Phone *</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.phone }"
                  v-model="form.phone"
                  placeholder="Enter phone number"
                />
                <div class="invalid-feedback" v-if="errors.phone">
                  {{ errors.phone }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Password {{ isEditMode ? '' : '*' }}</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  v-model="form.password"
                  :placeholder="isEditMode ? 'Leave empty to keep current password' : 'Enter password'"
                />
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>



              <!-- Additional Information -->
              <div class="col-md-12 mb-3">
                <label class="form-label text-muted">Description</label>
                <textarea
                  class="form-control"
                  v-model="form.description"
                  rows="3"
                  placeholder="Enter description"
                ></textarea>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Address</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.address"
                  placeholder="Enter address"
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Luxota Website</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="form.luxota_website"
                  placeholder="Enter Luxota website URL"
                />
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label text-muted">Country Code</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.country_code"
                  placeholder="e.g., IR"
                />
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label text-muted">WhatsApp Number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.whatsapp_number"
                  placeholder="Enter WhatsApp number"
                />
              </div>
              <div class="col-md-4 mb-3 select-wrapper"
                    id="select-wrapper-1">
                <label class="form-label text-muted" :class="{ 'is-invalid': errors.role_id }">Role *</label>
                <select
                  class="set_select2 "
                  v-model="form.role_id"
                >
                  <option value="">Select Role</option>
                  <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.role_id">
                  {{ errors.role_id }}
                </div>
              </div>



              <!-- Location Information -->
              <div class="col-md-4 mb-3 select-wrapper">
                <label class="form-label text-muted " :class="{ 'is-invalid': errors.zone_id }">Zone *</label>
                <select
                  class="set_select2 "

                  v-model="form.zone_id"
                  @change="onZoneChange"
                >
                  <option value="">Select Zone</option>
                  <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                    {{ zone.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.zone_id">
                  {{ errors.zone_id }}
                </div>
              </div>

              <div class="col-md-4 mb-3 select-wrapper">
                <label class="form-label text-muted" :class="{ 'is-invalid': errors.city_id }">City *</label>
                <select
                  class="set_select2 "

                  v-model="form.city_id"
                >
                  <option value="">Select City</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.city_id">
                  {{ errors.city_id }}
                </div>
              </div>

              <div class="col-md-4 mb-3 select-wrapper">
                <label class="form-label text-muted" :class="{ 'is-invalid': errors.branch_id }">Branch *</label>
                <select
                  class="set_select2 "

                  v-model="form.branch_id"
                >
                  <option value="">Select Branch</option>
                  <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                    {{ branch.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.branch_id">
                  {{ errors.branch_id }}
                </div>
              </div>

              <!-- Rank and Referrer -->
              <div class="col-md-4 mb-3 select-wrapper" >
                <label class="form-label text-muted" :class="{ 'is-invalid': errors.rank_id }">Rank *</label>
                <select
                  class="set_select2"

                  v-model="form.rank_id"
                >
                  <option value="">Select Rank</option>
                  <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
                    {{ rank.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.rank_id">
                  {{ errors.rank_id }}
                </div>
              </div>

              <div class="col-md-4 mb-3 select-wrapper" >
                <label class="form-label text-muted" :class="{ 'is-invalid': errors.referrer_id }">Referrer *</label>
                <select
                  class="set_select2"

                  v-model="form.referrer_id"
                  data-role="referrer"
                >
                  <option value="">Select Referrer</option>
                  <option v-for="user in referrers" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.referrer_id">
                  {{ errors.referrer_id }}
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label text-muted">Parent User</label>
                <select class="form-select" v-model="form.parent_id">
                  <option value="">Select Parent User</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="submit" :disabled="createUser" class="btn btn-primary" :class="{ 'opacity-50': createUser }">
                {{ createUser ? 'Loading...' : (isEditMode ? 'Update User' : 'Create User') }}
              </button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createUser">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="delete" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Delete User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p>Are you sure you want to delete user <strong>{{ userName }}</strong>?</p>
          <p class="text-danger">Warning: Deleting this User will also delete all related data.</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
            :disabled="isDeleting"
            type="button"
            class="btn btn-danger"
            :class="{ 'opacity-50': isDeleting }"
            @click="confirmDeleteUser"
          >
            {{ isDeleting ? 'Loading...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue'

const nuxtApp = useNuxtApp()
definePageMeta({
  layout: 'dashboard',
})
useHead({
  link: [
     { rel: 'stylesheet',  href: '/dashboard-assets/css/select2.min.css' },
   ],
  script: [
    {
      src: '/dashboard-assets/js/jquery-3.6.1.min.js',
      type: 'text/javascript'
    },
    {
      src: '/dashboard-assets/js/select22.min.js',
      type: 'text/javascript'
    },
    // {
    //   src: '/dashboard-assets/js/select2.js',
    //   type: 'text/javascript'
    // }
  ]
})
const config = useRuntimeConfig()

// Reactive data
const isLoadingModalData = ref(false)
const isLoadingUsers = ref(false)
const page = ref(1)
const perPage = ref(15)
const users = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedUserId = ref(null)
const isDeleting = ref(false)
const createUser = ref(false)
const isEditMode = ref(false)
const currentUser = ref(null)

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  description: '',
  avatar: '',
  address: '',
  luxota_website: '',
  country_code: '',
  whatsapp_number: '',
  role_id: '',
  zone_id: '',
  city_id: '',
  rank_id: '',
  referrer_id: '',
  branch_id: '',
  parent_id: '',
})

// Search and filter
const searchQuery = reactive({
  name: '',
  email: '',
  status: '',
  role_id: '',
})

// Dropdown data
const roles = ref([])
const zones = ref([])
const cities = ref([])
const ranks = ref([])
const branches = ref([])
const referrers = ref([])

// Computed
const userName = computed(() => {
  const user = users.value?.data?.find(u => u.id === selectedUserId.value)
  return user ? user.name : ''
})

function setUser(id) {
  selectedUserId.value = id
}


function closeModalAndResetForm() {
  destroySelect2();
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  resetForm()
}

function resetForm() {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  isEditMode.value = false
  currentUser.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

// Debounced search
let searchTimeout
function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchUsers()
  }, 500)
}

function clearSearch() {
  Object.keys(searchQuery).forEach(key => {
    searchQuery[key] = ''
  })
  page.value = 1
  fetchUsers()
}

// Fetch data
async function fetchUsers() {
  error.value = null
  isLoadingUsers.value = true
  try {
    const params = new URLSearchParams({
      page: page.value,
      ...searchQuery
    })
    
    const { data: responseUsers } = await useFetch(`/users?${params}`, {
      baseURL: config.public.apiBase
    })
    users.value = responseUsers.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingUsers.value = false
  }
}

async function fetchDropdownData() {
  try {
    console.log('Fetching dropdown data...')
    
    const [rolesRes, zonesRes, ranksRes, branchesRes, referrersRes] = await Promise.all([
      $fetch('/roles/all', { baseURL: config.public.apiBase }),
      $fetch('/zones/all', { baseURL: config.public.apiBase }),
      $fetch('/ranks/all', { baseURL: config.public.apiBase }),
      $fetch('/branches/all', { baseURL: config.public.apiBase }),
      // $fetch('/users/all', { baseURL: config.public.apiBase }),
    ])
    
    console.log('Dropdown data loaded successfully:')
    console.log('Roles7:', rolesRes.data?.length || 0)
    console.log('Zones:', zonesRes?.length || 0)
    console.log('Ranks:', ranksRes?.length || 0)
    console.log('Branches:', branchesRes?.length || 0)
    console.log('Referrers:', referrersRes?.length || 0)
    
    roles.value = rolesRes.data || []
    zones.value = zonesRes.data || []
    ranks.value = ranksRes.data || []
    branches.value = branchesRes.data || []
    referrers.value = referrersRes.data || []
    
    return true
  } catch (e) {
    console.error('Error fetching dropdown data:', e)
    return false
  }
}

async function fetchCities(zoneId) {
  if (!zoneId) {
    cities.value = []
    return
  }
  
  try {
    const citiesRes = await $fetch(`/cities?zone_id=${zoneId}`, { baseURL: config.public.apiBase })
    cities.value = citiesRes.data || []
  } catch (e) {
    console.error('Error fetching cities:', e)
    cities.value = []
  }
}

function onZoneChange() {
  form.city_id = ''
  fetchCities(form.zone_id)
  
  // Update city Select2 after cities are loaded
  setTimeout(() => {
    if (typeof $ !== 'undefined' && $.fn.select2) {
      // Find the city select element specifically
      const citySelect = $('.js-example-basic-single').eq(2) // City is the 3rd select
      if (citySelect.length) {
        citySelect.select2('destroy')
        citySelect.select2({
          width: '100%',
          placeholder: 'Select City',
          allowClear: true,
          minimumResultsForSearch: 0,
          language: {
            noResults: function() {
              return "No cities found";
            },
            searching: function() {
              return "Searching cities...";
            }
          }
        })
      }
    }
  }, 300)
}

function goToPage(newPage) {
  page.value = newPage
}

async function toggleStatus(user) {
  if (isLoadingId.value) return
  isLoadingId.value = user.id
  try {
    const response = await $fetch(`/users/${user.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    user.status = user.status === 1 ? 0 : 1
  } catch (error) {
    console.error('Error toggling status:', error)
  } finally {
    isLoadingId.value = null
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!form.name || form.name.trim() === '') {
    errors.name = 'Name is required.'
  }
  
  if (!form.email || form.email.trim() === '') {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  
  if (!isEditMode.value && (!form.password || form.password.trim() === '')) {
    errors.password = 'Password is required.'
  } else if (form.password && form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  
  if (!form.phone || form.phone.trim() === '') {
    errors.phone = 'Phone is required.'
  }
  //
  if (!form.role_id) {
    errors.role_id = 'Role is required.'

  }

  if (!form.zone_id) {
    errors.zone_id = 'Zone is required.'
  }

  if (!form.city_id) {
    errors.city_id = 'City is required.'
  }

  if (!form.rank_id) {
    errors.rank_id = 'Rank is required.'
  }

  if (!form.referrer_id) {
    errors.referrer_id = 'Referrer is required.'
  }

  if (!form.branch_id) {
    errors.branch_id = 'Branch is required.'
  }
  
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  createUser.value = true
  const payload = new FormData()

  Object.keys(form).forEach(key => {
    if (form[key] !== '' && form[key] !== null) {
      payload.append(key, form[key])
    }
  })

  try {
    if (isEditMode.value && currentUser.value?.id) {
      await $fetch(`/users/${currentUser.value.id}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
        }
      })
      nuxtApp.$toast({
        title: 'Success!',
        message: 'User updated successfully.',
        type: 'success',
        duration: 3000
      })
    } else {
      await useFetch('/users', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'Success!',
        message: 'User created successfully.',
        type: 'success',
        duration: 3000
      })
    }

    createUser.value = false
    await fetchUsers()
    closeModalAndResetForm()
  } catch (e) {
    console.error('Error sending data:', e)
    createUser.value = false
  }
}
function initSelect2() {
  console.log('Initializing Select2...')
  console.log('Available data:')
  console.log('Roles:', roles.value?.length || 0)
  console.log('Zones:', zones.value?.length || 0)
  console.log('Ranks:', ranks.value?.length || 0)
  console.log('Branches:', branches.value?.length || 0)
  console.log('Cities:', cities.value?.length || 0)
  
  $('.set_select2').each(function () {
    const $select = $(this);
    const selectId = $select.attr('id') || $select.attr('name') || 'unknown'
    
    console.log(`Initializing Select2 for: ${selectId}`)
    console.log('Select element:', $select[0])
    console.log('Select options count:', $select.find('option').length)
    
    if ($select.next('.select2').length) {
      $select.select2('destroy');
    }

    const $parent = $select.closest('.select-wrapper');
    $select.select2({
      dropdownParent: $parent.length ? $parent : $('body'),
      width: '100%',
      placeholder: 'Select an option',
      allowClear: true,
      minimumResultsForSearch: 0,
      language: {
        noResults: function() {
          return "No results found";
        },
        searching: function() {
          return "Searching...";
        }
      }
    });
    
    console.log(`Select2 initialized for: ${selectId}`)
    console.log('Select2 element created:', $select.next('.select2').length > 0)
  });
}

function destroySelect2() {
  $('.set_select2').each(function () {
    const $select = $(this);
    if ($select.next('.select2').length) {
      $select.select2('destroy');
    }
  });
}

// Function to populate select options based on data
function populateSelectOptions() {
  console.log('Populating select options...')
  
  // Populate roles
  const roleSelect = document.querySelector('select[v-model="form.role_id"]')
  if (roleSelect && roles.value?.length > 0) {
    console.log('Populating roles:', roles.value.length)
    roleSelect.innerHTML = '<option value="">Select Role</option>'
    roles.value.forEach(role => {
      const option = document.createElement('option')
      option.value = role.id
      option.textContent = role.title
      roleSelect.appendChild(option)
    })
  }
  
  // Populate zones
  const zoneSelect = document.querySelector('select[v-model="form.zone_id"]')
  if (zoneSelect && zones.value?.length > 0) {
    console.log('Populating zones:', zones.value.length)
    zoneSelect.innerHTML = '<option value="">Select Zone</option>'
    zones.value.forEach(zone => {
      const option = document.createElement('option')
      option.value = zone.id
      option.textContent = zone.name
      zoneSelect.appendChild(option)
    })
  }
  
  // Populate cities
  const citySelect = document.querySelector('select[v-model="form.city_id"]')
  if (citySelect && cities.value?.length > 0) {
    console.log('Populating cities:', cities.value.length)
    citySelect.innerHTML = '<option value="">Select City</option>'
    cities.value.forEach(city => {
      const option = document.createElement('option')
      option.value = city.id
      option.textContent = city.name
      citySelect.appendChild(option)
    })
  }
  
  // Populate branches
  const branchSelect = document.querySelector('select[v-model="form.branch_id"]')
  if (branchSelect && branches.value?.length > 0) {
    console.log('Populating branches:', branches.value.length)
    branchSelect.innerHTML = '<option value="">Select Branch</option>'
    branches.value.forEach(branch => {
      const option = document.createElement('option')
      option.value = branch.id
      option.textContent = branch.name
      branchSelect.appendChild(option)
    })
  }
  
  // Populate ranks
  const rankSelect = document.querySelector('select[v-model="form.rank_id"]')
  if (rankSelect && ranks.value?.length > 0) {
    console.log('Populating ranks:', ranks.value.length)
    rankSelect.innerHTML = '<option value="">Select Rank</option>'
    ranks.value.forEach(rank => {
      const option = document.createElement('option')
      option.value = rank.id
      option.textContent = rank.title
      rankSelect.appendChild(option)
    })
  }
  
  // Populate referrers
  const referrerSelect = document.querySelector('select[v-model="form.referrer_id"]')
  if (referrerSelect && referrers.value?.length > 0) {
    console.log('Populating referrers:', referrers.value.length)
    referrerSelect.innerHTML = '<option value="">Select Referrer</option>'
    referrers.value.forEach(user => {
      const option = document.createElement('option')
      option.value = user.id
      option.textContent = `${user.name} (${user.email})`
      referrerSelect.appendChild(option)
    })
  }
}

onMounted(() => {
  const modal = $('#create');
  
  // Load initial data
  fetchDropdownData()
  
  modal.on('shown.bs.modal', async () => {
    console.log('Modal shown, initializing Select2...')
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      initSelect2()
      console.log('Select2 initialized on modal show')
    }, 200)
  });

  modal.on('hidden.bs.modal', () => {
    console.log('Modal hidden, destroying Select2...')
    destroySelect2();
  });
});

async function openModal(user = null) {
  resetForm()
  
  if (user) {
    isEditMode.value = true
    currentUser.value = user
    
    // Populate form
    Object.keys(form).forEach(key => {
      if (user[key] !== undefined) {
        form[key] = user[key]
      }
    })
    
    // Fetch cities if zone is selected
    if (form.zone_id) {
      await fetchCities(form.zone_id)
    }
  }
  
  // Load dropdown data
  await fetchDropdownData()
  await nextTick()
  
  // Populate options and initialize Select2
  setTimeout(() => {
    console.log('Populating options in openModal...')
    populateSelectOptions()
    
    setTimeout(() => {
      console.log('Initializing Select2 in openModal...')
      initSelect2()
      
      // Set values for edit mode if needed
      if (isEditMode.value && currentUser.value) {
        setTimeout(() => {
          console.log('Setting values for edit mode...')
          $('.set_select2').each(function(index) {
            const $select = $(this)
            const fieldName = $select.attr('v-model') || $select.attr('name')
            
            if (fieldName === 'form.role_id' && form.role_id) {
              $select.val(form.role_id).trigger('change')
            } else if (fieldName === 'form.zone_id' && form.zone_id) {
              $select.val(form.zone_id).trigger('change')
            } else if (fieldName === 'form.city_id' && form.city_id) {
              $select.val(form.city_id).trigger('change')
            } else if (fieldName === 'form.branch_id' && form.branch_id) {
              $select.val(form.branch_id).trigger('change')
            } else if (fieldName === 'form.rank_id' && form.rank_id) {
              $select.val(form.rank_id).trigger('change')
            } else if (fieldName === 'form.referrer_id' && form.referrer_id) {
              $select.val(form.referrer_id).trigger('change')
            }
          })
        }, 200)
      }
    }, 100)
  }, 300)
}

async function confirmDeleteUser() {
  if (!selectedUserId.value) return
  
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/users/${selectedUserId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete user.')
      console.error(error.value)
      return
    }
    
    nuxtApp.$toast({
      title: 'Success!',
      message: 'User moved to trash.',
      type: 'success',
      duration: 3000
    })
    
    await fetchUsers()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedUserId.value = null
  }
}

// Watch for data changes and reinitialize Select2
watch([roles, zones, ranks, branches, cities], async (newValues) => {
  // Check if any of the arrays have data
  const hasData = newValues.some(arr => arr && arr.length > 0)
  
  if (hasData) {
    console.log('Data loaded, initializing Select2...')
    console.log('New values:', newValues.map(arr => arr?.length || 0))
    
    // Wait for Vue to update the DOM
    await nextTick()
    
    // Wait a bit more to ensure DOM is fully updated
    setTimeout(() => {
      console.log('DOM should be updated now, populating options...')
      
      // Populate select options manually
      populateSelectOptions()
      
      // Wait a bit more then initialize Select2
      setTimeout(() => {
        console.log('Initializing Select2 after populating options...')
        initSelect2()
      }, 100)
    }, 200)
  }
}, { deep: true })


// Lifecycle
watchEffect(() => {
  fetchUsers()
})


</script>
