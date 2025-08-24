<!-- pages/dashboard/users/index.vue -->
<template>
  <div v-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">{{ $route.params.role }} Users</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">{{ $route.params.role }} Users</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              {{ $route.params.role }} Users
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('user.create')"
                  class="btn btn-sm btn-success-light mx-1 modal-effect"
                  data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create"
                  @click="openModal()">
                Create {{ $route.params.role }} User<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
              <NuxtLink v-if="auth.user.permissions.includes('user.trash')" :to="`/dashboard/users/trash/${$route.params.role}`" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-show="!loadingUsers" class="row mb-3">
              <div class="col-md-2">
                <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery.name"
                    placeholder="Search by name..."
                />
              </div>
              <div class="col-md-2">
                <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery.email"
                    placeholder="Search by email..."
                />
              </div>
              <div class="col-md-2 ">
                <select id="select-status" class="form-select-lg "
                        name="searchQuertStatus"
                        ref="searchQuertStatus"
                        v-model="searchQuery.status" >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div v-if="!isSearching" class="col-md-2">
                <button  class="btn btn-success-light ms-2" @click="search">Submit</button>
                <button class="btn btn-danger-light ms-1" @click="clearSearch">Clear</button>
              </div>
              <div v-else class="col-md-2">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Searching..</span>
                </div>
              </div>
            </div>
            <div v-if="loadingUsers" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="users && users.data && users.data.length === 0">
              <EmptyState/>
            </div>
            <div  v-else-if="users && users.data && users.data.length > 0" class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, index) in users?.data" :key="user.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-md me-2">
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
                    <span v-if="isNotCurrentUser(user)"
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
                        <li><a v-if="auth.user.permissions.includes('user.update')" @click="openModal(user)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal"
                               href="#create"
                               class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === user.id }"
                               :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }"
                               :data-user-id="user.id">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="isNotCurrentUser(user)">
                          <a v-if="auth.user.permissions.includes('user.delete')" data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"
                                                               @click="setUser(user.id)" class="dropdown-item modal-effect" href="#delete"
                                                               :class="{ 'disabled': isLoadingId === user.id }"
                                                               :style="{ pointerEvents: isLoadingId === user.id ? 'none' : 'auto' }">Delete</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <nav v-if="pagination.meta.last_page > 1" class="pagination-style-4 mt-2" aria-label="Page navigation">
              <ul class="pagination mb-0 flex-wrap">
                <li class="page-item" :class="{ disabled: pagination.meta.current_page === 1 }">
                  <a class="page-link" href="#" @click.prevent="goToPage(pagination.meta.current_page - 1)">
                    Prev
                  </a>
                </li>

                <li
                    v-for="page in getDisplayedPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.meta.current_page, disabled: page === '...' }"
                >
                  <a
                      v-if="page !== '...'"
                      class="page-link ms-1"
                      href="#"
                      @click.prevent="goToPage(page)"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link" style="pointer-events: none;">...</span>
                </li>

                <li class="page-item" :class="{ disabled: pagination.meta.current_page === pagination.meta.last_page }">
                  <a class="page-link" href="#" @click.prevent="goToPage(pagination.meta.current_page + 1)">
                    Next
                  </a>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </div>
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
            <h5 class="modal-title" id="createUserLabel">
              {{ isEditMode ? 'Update User' : `Create ` + $route.params.role + ` User` }}</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>
          </div>

          <div class="modal-body text-start" >
            <!-- Loader -->
            <div v-show="isLoadingModal" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <form v-show="!isLoadingModal" @submit.prevent="handleSubmit">
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
                  <div class="input-group" :class="{ 'is-invalid': errors.whatsapp_country_code }">
                    <div class="select-wrapper" style="padding: 0; border: none;  width: 180px;">
                      <select
                          name="whatsapp_country_code"

                          ref="whatsappCountryCodeSelect"
                          class="choices-select phone-code-select w-25"
                          v-model="form.whatsapp_country_code"
                          placeholder="Country Code"

                      >
                        <option v-for="(country, countryKey) in countries" :key="countryKey" :value="country">
                          {{ country }}
                        </option>
                      </select>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.whatsapp_number }"
                        v-model="form.whatsapp_number"
                        placeholder="Enter WhatsApp number"
                    />
                  </div>
                  <div class="invalid-feedback" v-if="errors.whatsapp_number">
                    {{ errors.whatsapp_number }}
                  </div>
                  <div class="invalid-feedback" v-if="errors.whatsapp_country_code">
                    {{ errors.whatsapp_country_code }}
                  </div>
                </div>




                <div v-if="createForm.password" class="col-md-4 mb-3">
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
                  <div class="card-body">
                    <select
                        name="zone_id"
                        v-model="form.zone_id"
                        placeholder="Please Select Zone"
                        class="form-control choices-select"
                    >
                      <option v-for="(zone, zoneKey) in zones" :key="zoneKey" :value="zoneKey">
                        {{ zone }}
                      </option>
                    </select>
                  </div>
                  <div class="invalid-feedback" v-if="errors.zone_id">
                    {{ errors.zone_id }}
                  </div>

                </div>
                <div  class="col-md-12 mb-3">
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

                <div v-if="createForm.luxota_website" class="col-md-4 mb-3">
                  <label class="form-label text-muted">Luxota Website</label>
                  <input
                      type="url"
                      class="form-control"
                      v-model="form.luxota_website"
                      placeholder="Enter Luxota website URL"
                  />
                </div>


                <!-- Location Information -->

                <div v-show="createForm.city" class="col-md-4 mb-3 select-wrapper">
                  <label class="form-label text-muted" :class="{ 'is-invalid': errors.city_id }">City *</label>
                  <select
                      name="city"
                      ref="citySelect"
                      id="city-select"
                      class="set_select2 "
                      v-model="form.city_id"
                  >
                  </select>

                  <div class="invalid-feedback" v-if="errors.city_id">
                    {{ errors.city_id }}
                  </div>
                </div>
                <div v-if="createForm.website" class="col-md-4 mb-3 ">
                  <label class="form-label text-muted">Websites</label>
                  <div class="row gx-3">
                    <div class="col-md-10">
                      <input
                          type="url"
                          class="form-control"
                          v-model="website"
                          placeholder="Enter website URL"
                      />
                    </div>
                    <div class="col-md-2 ">
                      <button @click="addWebsite" type="button" class="btn btn-primary btn-wave waves-effect waves-light">
                        Add
                      </button>
                    </div>
                  </div>
                  <div class="d-flex gap-1 flex-wrap">
                    <button v-for="(site , index) in form.websites" :key="index"
                            type="button"
                            class="btn btn-secondary btn-sm shadow-sm btn-wave waves-effect waves-light mt-1">{{ site }}
                      <i class="bx bx-trash ms-3"
                         @click="removeWebsite(index)"></i></button>
                  </div>

                </div>
                <div v-show="createForm.branch" class="col-md-4 mb-3 select-wrapper">
                  <label class="form-label text-muted" :class="{ 'is-invalid': errors.branch_id }">Branch *</label>
                  <select
                      class="choices-select "
                      name="branch_id"
                      placeholder="Please Select Branch"
                      v-model="form.branch_id"
                  >
                    <option v-for="(branch, branchKey) in branches" :key="branchKey" :value="branchKey">
                      {{ branch }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.branch_id">
                    {{ errors.branch_id }}
                  </div>
                </div>

                <div v-show="createForm.rank" class="col-md-4 mb-3 select-wrapper">
                  <label class="form-label text-muted" :class="{ 'is-invalid': errors.rank_id }">Rank *</label>
                  <select
                      class="choices-select"
                      placeholder="Please Select Rank"
                      name="rank_id"
                      v-model="form.rank_id"
                  >
                    <option v-for="(rank, rankKey) in ranks" :key="rankKey" :value="rankKey">
                      {{ rank }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.rank_id">
                    {{ errors.rank_id }}
                  </div>
                </div>

                <div v-show="createForm.referrer" class="col-md-4 mb-3 select-wrapper">
                  <label class="form-label text-muted" :class="{ 'is-invalid': errors.referrer_id }">Referrer *</label>
                  <select
                      class="choices-select"
                      name="referrer_id"
                      placeholder="Please Select Referrer"

                      v-model="form.referrer_id"
                      data-role="referrer"
                  >
                    <option v-for="(referrer , referrerKey) in referrers" :key="referrerKey" :value="referrerKey">
                      {{ referrer }}
                    </option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.referrer_id">
                    {{ errors.referrer_id }}
                  </div>
                </div>
                <div v-show="createForm.parent" class="col-md-6 mb-3">
                  <label class="form-label text-muted">Parent User</label>
                  <select name="parent_id"
                          placeholder="Please Select Parent"
                          class="choices-select"
                          v-model="form.parent_id">
                    <option v-for="user in parents" :key="user?.id" :value="user?.id">
                      {{ user.name }} ({{ user.email }})
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
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
                      <img :src="imagePreview" alt="Preview" class="img-thumbnail rounded" style="max-width: 300px;"/>
                    </div>
                  </div>
                </div>


              </div>

              <div class="modal-footer">
                <button type="submit" :disabled="createNewUser" class="btn btn-primary"
                        :class="{ 'opacity-50': createNewUser }">
                  {{ createNewUser ? 'Loading...' : (isEditMode ? 'Update User' : 'Create User') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createNewUser">Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="delete" aria-hidden="true"
         data-bs-backdrop="static" data-bs-keyboard="false">
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
  </div>
  <div v-else class="alert alert-danger mt-3 text-center">
    <slot name="fallback">
      🚫 You do not have permission to view this section.
    </slot>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('user.index') || false
})


const nuxtApp = useNuxtApp()
const route = useRoute()
const router = useRouter()
definePageMeta({
  layout: 'dashboard',
  middalware:'auth'
})
useHead({
  link: [
    {rel: 'stylesheet', href: '/dashboard-assets/css/select2.min.css'},
  ],
  script: [
    {
      src: '/dashboard-assets/js/jquery-3.6.1.min.js',
      type: 'text/javascript'
    },
    {
      src: '/dashboard-assets/js/choices.min.js',
      type: 'text/javascript'
    },
  ]
})
const config = useRuntimeConfig()
const isLoadingUsers = ref(false)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedUserId = ref(null)
const isDeleting = ref(false)
const createNewUser = ref(false)
const isEditMode = ref(false)
const currentUser = ref(null)
const userName = ref('')
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
const zones = ref([])
const cities = ref([])
const ranks = ref([])
const branches = ref([])
const parents = ref([])
const referrers = ref([])
const countries = ref([])
const imagePreview = ref(null)
const isSearching = ref(false)
const isLoadingModal = ref(1)
const website = ref(null)
const isDropdownDataLoaded = ref(false)
const {roles, loadingRole, errorRole, getRoles} = useRoles();
const {users, role, user, loadingUsers, errorUser,formData, pagination,
  currentPage, deleteUser,  loadUserFormData, getUsersWithRoleName, getUserById,goToPage, createUser, updateUser, page, perPage, setPage,searchUsers} = useUsers()
const createForm = ref({})
const choicesInstances = {}
watch(
    () => auth.user,
    async (user) => {
      if (user && hasPermission.value) {
        loadingUsers.value = true
        await getUsersWithRoleName(route.params.role, searchQuery)
        await nextTick()
        loadSelectChoice()
        loadingUsers.value = false
      }
    },
    { immediate: true }
)
function isNotCurrentUser (user) {
  const currentUserId = auth?.user?.user?.id;
  return currentUserId && currentUserId !== user.id;
}
function createFormInputs(){
  if (role.value.id === 1) {
    createForm.value = {
      name: true,
      email: true,
      whatsapp: true,
      city: true,
      zone: true,
      avatar: true,
      password: true,
      phone: true,
      rank: true,
      branch: true,
      referrer: true,
      luxota_website: true,
      website: true,
      parent: true,
    }
  } else {
    createForm.value = {
      name: true,
      email: true,
      whatsapp: true,
      city: true,
      zone: true,
      avatar: true,
      password: true,
      phone: true,
    }
  }
}

function previewImage(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imagePreview.value = URL.createObjectURL(file)
    form.avatar = file
  } else {
    imagePreview.value = null
  }
}

async function search(){
  isSearching.value= true
  try {
    await getUsersWithRoleName(route.params.role,searchQuery)
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    isSearching.value = false;
  }

}

function addWebsite() {
  const newSite = website.value.trim()
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
  const user = users.value.data.find(u => u.id === id)
  userName.value = user ? user.name : ''
}

function closeModalAndResetForm() {
  remove_choice_value()
  getUsersWithRoleName(route.params.role)
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
  createNewUser.value = false
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

function remove_choice_value() {
  Object.entries(choicesInstances).forEach(([key, instance]) => {
    if (
        instance &&
        typeof instance.removeActiveItems === 'function' &&
        instance.containerOuter // اختیاری اما مفیده
    ) {
      instance.removeActiveItems()
    }
  })
}

function clearSearch() {
  Object.keys(searchQuery).forEach(key => {
    searchQuery[key] = ''
  })
  setPage(1)
  getUsersWithRoleName(route.params.role,currentPage)
}

const getDisplayedPages = computed(() => {
  const meta = pagination.value.meta
  if (!meta || !meta.last_page) return []

  const current = meta.current_page
  const last = meta.last_page
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

async function toggleStatus(user) {
  if (isLoadingId.value) return
  isLoadingId.value = user.id

  try {
    const payload = new FormData()
    Object.keys(user).forEach(key => {
      if (user[key] !== '' && user[key] !== null) {
        if (key === 'avatar') {
          if (user[key] instanceof File) {
            payload.append('avatar', user[key])
          }
          return
        }
        payload.append(key, user[key])
      }
    })
    payload.append('status', user.status === 1 ? 0 : 1)
    await updateUser(user.id, payload)
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


  if (!form.whatsapp_country_code) {
    errors.whatsapp_country_code = 'Whatsapp country code is required.'
  }
  if (!form.whatsapp_number) {
    errors.whatsapp_number = 'Whatsapp number is required.'
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
  if (!form.phone || form.phone.trim() === '') {
    errors.phone = 'Phone is required.'
  } else if (!/^\d+$/.test(form.phone)) {
    errors.phone = 'Phone must contain only numbers.'
  }
  if (form.role_id === 1) {


    if (!form.rank_id) {
      errors.rank_id = 'Rank is required.'
    }

    if (!form.referrer_id) {
      errors.referrer_id = 'Referrer is required.'
    }

    if (!form.branch_id) {
      errors.branch_id = 'Branch is required.'
    }
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {

  if (!validateForm()) return
  createNewUser.value = true
  const payload = new FormData()
  Object.keys(form).forEach(key => {
    if (form[key] !== '' && form[key] !== null) {
      if (key === 'avatar') {
        if (form[key] instanceof File) {
          payload.append('avatar', form[key])
        }
        return
      }
      payload.append(key, form[key])
    }
  })
  try {
    if (isEditMode.value && currentUser.value?.id) {
      await updateUser(currentUser.value.id,payload, errors)
    } else {
      await createUser(payload, errors)
    }
  } catch (e) {
    console.error('Error sending data:', e)
  }finally {
    if (Object.keys(errors).length === 0) {
      closeModalAndResetForm()
    }else{
      createNewUser.value = false
    }
  }
}

function loadSelectChoice(){
  let selectStatus= document.getElementById('select-status');
  new Choices(selectStatus, {
    placeholder: true,
    placeholderValue: 'Please Select Status',
    itemSelectText: '',
    removeItemButton: true,
  })
}
async function initSelect() {
  await nextTick()
  document.querySelectorAll('.choices-select').forEach((el) => {
    const fieldName = el.getAttribute('name')
    const placeholder = el.getAttribute('placeholder') || 'Please select'

    const existingInstance = choicesInstances[fieldName]
    if (existingInstance && typeof existingInstance.destroy === 'function') {
      existingInstance.destroy()
      delete choicesInstances[fieldName]

      // پاک کردن flag تا امکان init دوباره باشه
      delete el.dataset.choicesInitialized
    }

    if (el.dataset.choicesInitialized === 'true') {
      return // قبلاً برای این عنصر Choices ساخته شده
    }

    if (fieldName && form[fieldName] !== undefined) {
      el.value = form[fieldName]
    }

    const instance = new Choices(el, {
      placeholder: true,
      classNames: {
        listDropdown: ['choices__list--dropdown'],
      },
      placeholderValue: placeholder,
      searchEnabled: true,
      itemSelectText: '',
      removeItemButton: true,
    })

    el.dataset.choicesInitialized = 'true'

    // مقداردهی اولیه
    if (form[fieldName]) {
      instance.setChoiceByValue(form[fieldName].toString())
    }

    // ذخیره instance
    choicesInstances[fieldName] = instance
  })
}

async function initSelectWithSearch(initialCity = null) {
  const el = document.querySelector('#city-select')
  if (!el) {
    console.error('Select element with ID #city-select not found')
    return
  }

  const fieldName = el.getAttribute('name') || 'city'

  // destroy previous if exists
  if (choicesInstances[fieldName]) {
    choicesInstances[fieldName].destroy()
    delete choicesInstances[fieldName]
  }

  const choices = new Choices(el, {
    searchEnabled: true,
    shouldSort: false,
    placeholder: true,
    placeholderValue: 'You must type at least 3 characters',
    noResultsText: 'No results found',
    removeItemButton: false,
    fuseOptions: null,
    searchFloor: 3,
  })

  // ذخیره در آبجکت global
  choicesInstances[fieldName] = choices

  if (initialCity?.id && initialCity?.label) {
    choices.setChoices(
        [
          {
            value: initialCity.id,
            label: initialCity.label,
            selected: true,
          }
        ],
        'value',
        'label',
        false
    )
  }

  await nextTick()
  const container = el.closest('.choices')
  if (!container) {
    console.error('Choices container not found for #city-select')
    return
  }

  const searchInput = container.querySelector('.choices__input--cloned')
  if (!searchInput) {
    console.error('Could not find Choices search input element')
    return
  }

  let debounceTimer

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim()
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
      if (searchTerm.length < 3) {
        choices.clearChoices()
        return
      }

      try {
        const response = await fetch(
            `${config.public.apiBase}/cities/search?en=${encodeURIComponent(searchTerm)}`
        )
        const json = await response.json()

        const cities = Array.isArray(json.data)
            ? json.data
                .filter(city => city.id && city.en)
                .map(city => ({
                  value: city.id,
                  label: `${city.country.name} - ${city.en}`
                }))
            : []

        choices.setChoices(cities, 'value', 'label', true)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }, 1000)
  })
}

async function openModal(userSelect = null) {
  isLoadingModal.value = 1
  resetForm()
  remove_choice_value()
  await loadUserFormData()
  roles.value = formData.value.roles || []
  countries.value = formData.value.countries || []
  zones.value = formData.value.zones || []
  branches.value = formData.value.branches || []
  ranks.value = formData.value.ranks || []
  referrers.value = formData.value.referrers || []
  parents.value = formData.value.parents || []
  pagination.value.meta = users.value.meta
  pagination.value.links = users.value.links
  await nextTick()
  form.role_id = role.value.id
  createFormInputs()
  if (userSelect) {
    isEditMode.value = true
    currentUser.value = userSelect
    await getUserById(userSelect.id)
    Object.keys(form).forEach(key => {
      if (user.value.data[key] !== undefined) {
        if (key === 'avatar') {
          imagePreview.value = `${config.public.fileBase}/${user.value.data[key]}`
        }
        if (key === 'websites' && user.value.data[key] !== null){
          form[key] = user.value.data[key].split(',')
          return
        }
        form[key] = user.value.data[key]
      }
    })
    initSelectWithSearch({
      id: user.value.data.city_id,
      label: `${user.value.data.city.country} - ${user.value.data.city.name}`
    })
  } else {
    initSelectWithSearch()
  }
  initSelect()
  isLoadingModal.value = 0

}

async function confirmDeleteUser() {
  if (!selectedUserId.value) return
  isDeleting.value = false

  try {
    isDeleting.value = true

    await deleteUser(selectedUserId.value)

    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    getUsersWithRoleName(route.params.role, searchQuery)
    isDeleting.value = false
    selectedUserId.value = null
  }
}

</script>
