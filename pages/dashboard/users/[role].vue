<!-- pages/dashboard/users/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">{{$route.params.role}} Users</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">{{$route.params.role}} Users</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            {{$route.params.role}} Users
          </div>
          <div class="prism-toggle">
            <button
                class="btn btn-sm btn-success-light mx-1 modal-effect"
                data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create"
                @click="openModal()">
              Create {{$route.params.role}} User<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/users/trash/{{$route.params.role}}" class="btn btn-sm btn-warning-light">Trash<i
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
          <h5 class="modal-title" id="createUserLabel">{{ isEditMode ? 'Update User' : `Create `+ $route.params.role +` User` }}</h5>
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
              <div v-if="createForm.name" class="col-md-4 mb-3">
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

              <div v-if="createForm.email" class="col-md-4 mb-3">
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

              <div v-if="createForm.phone" class="col-md-4 mb-3">
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
              <div v-show="createForm.whatsapp" class="col-md-4 mb-3">
                <label class="form-label text-muted">WhatsApp Number</label>
                <div class="input-group">
                  <div class="input-group-text select-wrapper" style="padding: 0; border: none;width: 150px">
                    <select
                      class="set_select2 phone-code-select"
                      v-model="form.country_code"
                      style="border: none; background: transparent; width: 220px; border-bottom-right-radius: 0; border-top-right-radius: 0;"
                  >
                    <option value="">Code</option>
                    <option v-for="country in countries" :key="country.id" :value="country.phone_code">
                      {{ country.phone_code }}
                    </option>
                  </select>
                  </div>
                  <input
                      type="text"
                      class="form-control"
                      v-model="form.whatsapp_number"
                      placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>


              <div v-if="createForm.password" class="col-md-4 mb-3" >
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
              <div v-show="createForm.zone" class="col-md-4 mb-3 select-wrapper">
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
              <div v-if="createForm.description" class="col-md-12 mb-3">
                <label class="form-label text-muted">Description</label>
                <textarea
                    class="form-control"
                    v-model="form.description"
                    rows="3"
                    placeholder="Enter description"
                ></textarea>
              </div>

              <div v-if="createForm.address" class="col-md-4 mb-3">
                <label class="form-label text-muted">Address</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.address"
                    placeholder="Enter address"
                />
              </div>

              <div v-if="createForm.luxota_website" class="col-md-4 mb-3" >
                <label class="form-label text-muted">Luxota Website</label>
                <input
                    type="url"
                    class="form-control"
                    v-model="form.luxota_website"
                    placeholder="Enter Luxota website URL"
                />
              </div>
              <div v-if="createForm.website" class="col-md-4 mb-3 " >
                <label class="form-label text-muted">Websites</label>
                <div class="row">
                  <div class="col-md-10">
                    <input
                        type="url"
                        class="form-control"
                        v-model="website"
                        placeholder="Enter Luxota website URL"
                    />
                  </div>
                  <div class="col-md-2 ">
                    <button @click="addWebsite" type="button" class="btn btn-primary btn-wave waves-effect waves-light">Add</button>
                  </div>
                </div>
                <div class="d-flex gap-1">
                    <button v-for = "(site , index) in form.websites" :key="index"
                            type="button" class="btn btn-secondary btn-sm shadow-sm btn-wave waves-effect waves-light mt-1">{{site}} <i class="bx bx-trash ms-3"
                                                                                                                           @click="removeWebsite(index)"></i></button>
                </div>

              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label text-muted">Phone Number</label>
                <div class="input-group">
                  <div class="input-group-text" style="padding: 0; border: none;">

                  </div>
                  <input
                      type="text"
                      class="form-control"
                      v-model="form.phone"
                      placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label text-muted">Phone Number</label>
                <div class="input-group">
                  <div class="input-group-text" style="padding: 0; border: none;">
                    <select
                        class="set_select2"
                        v-model="form.country_code"
                        style="border: none; background: transparent; min-width: 120px;"
                    >
                      <option value="">Code</option>
                      <option v-for="country in countries" :key="country.id" :value="country.phone_code">
                        {{ country.phone_code }}
                      </option>
                    </select>
                  </div>
                  <input
                      type="text"
                      class="form-control"
                      v-model="form.phone"
                      placeholder="Enter phone number"
                  />
                </div>
              </div>





              <!-- Location Information -->

              <div v-show="createForm.city" class="col-md-4 mb-3 select-wrapper">
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
              <div v-if="createForm.avatar" class="col-md-4">
                <div class="mb-3">
                  <label for="avatar" class="form-label">Image</label>
                  <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      @change="previewImage"
                      :class="{ 'is-invalid': errors.image }"
                      class="form-control"
                  />
                  <div class="invalid-feedback" v-if="errors.avatar">
                    {{ errors.avatar }}
                  </div>
                  <div v-if="imagePreview" class="mt-3 text-center">
                    <img :src="imagePreview" alt="Preview" class="img-thumbnail rounded" style="max-width: 300px;" />
                  </div>
                </div>
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
<style scoped>
.select2-container.phone-code-select {
  width: 220px !important;
}

</style>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const nuxtApp = useNuxtApp()
const route = useRoute()
const role = route.params.role
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

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  description: '',
  avatar: '',
  address: '',
  luxota_website: '',
  websites: [],
  country_code: '',
  whatsapp_country_code: '',
  whatsapp_number: '',
  role_id: '',
  zone_id: '',
  city_id: '',
  rank_id: '',
  referrer_id: '',
  branch_id: '',
  parent_id: '',
})
const searchQuery = reactive({
  name: '',
  email: '',
  status: '',
  role_id: '',
})
const roles = ref([])
const zones = ref([])
const cities = ref([])
const ranks = ref([])
const branches = ref([])
const referrers = ref([])
const countries = ref([])
const imagePreview = ref(null)
let searchTimeout
const userName = computed(() => {
  const user = users.value?.data?.find(u => u.id === selectedUserId.value)
  return user ? user.name : ''
})
const website = ref(null)
function previewImage(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imagePreview.value = URL.createObjectURL(file)
    form.avatar = file
  } else {
    imagePreview.value = null
  }
}

onMounted(async () => {
  await  fetchDropdownData()
  await nextTick()
  initSelect2()
  if (role === 'SuperAdmin'){
    createForm.value = {
      name: true,
      email: true,
      whatsapp:true,
      city:true,
      zone:true,
      avatar:true,
      password:true
    }
  }
});

function addWebsite() {
  const newSite = website.value.trim()
  console.log('form.websites type:', typeof form.websites)
  console.log('isArray:', Array.isArray(form.websites))
  console.log('form.websites:', form.websites)
  if (newSite && !form.websites.includes(newSite)) {
    form.websites.push(newSite)
    website.value = ''
  }
}
function removeWebsite(index) {
  form.websites.splice(index, 1)
}
function setUser(id) {
  selectedUserId.value = id
}
function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  resetForm()
}
function resetForm() {
  Object.keys(form).forEach(key => {
    if (Array.isArray(form[key])) {
      form[key] = []
    } else {
      form[key] = ''
    }
  })
  isEditMode.value = false
  currentUser.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

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

    const [rolesRes, zonesRes, ranksRes, branchesRes, countriesRes, citiesRes] = await Promise.all([
      $fetch('/roles/all', { baseURL: config.public.apiBase }),
      $fetch('/zones/all', { baseURL: config.public.apiBase }),
      $fetch('/ranks/all', { baseURL: config.public.apiBase }),
      $fetch('/branches/all', { baseURL: config.public.apiBase }),
      $fetch('/countries/all', { baseURL: config.public.apiBase }),
      $fetch('/cities/all', { baseURL: config.public.apiBase }),
    ])


    roles.value = rolesRes.data || []
    zones.value = zonesRes.data || []
    ranks.value = ranksRes.data || []
    cities.value = citiesRes.data || []
    branches.value = branchesRes.data || []
    countries.value = countriesRes.data || []

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

  if (!form.country_code) {
    errors.country_code = 'Country code is required.'
  }

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
const createForm = ref({})
function initSelect2() {
  $('.set_select2').each(function () {
    const $select = $(this);
    if (!$select.hasClass('select2-hidden-accessible')) {
      $select.select2();
      const $parent = $select.closest('.select-wrapper')
      const placeholderText = $select.find('option').first().text().trim()
      $select.select2({
        placeholder: placeholderText || 'Select',
        allowClear: true,
        dropdownParent: $parent.length ? $parent : $('body') // Fallback
      })
    }
  });
}

async function openModal(user = null) {
  resetForm()
  if (user) {
    isEditMode.value = true
    currentUser.value = user
    Object.keys(form).forEach(key => {
      if (user[key] !== undefined) {
        form[key] = user[key]
      }
    })
    if (form.zone_id) {
      await fetchCities(form.zone_id)
    }
  }

  // Load dropdown data
  await fetchDropdownData()
  await nextTick()
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

</script>
