<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Vouchers</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item" aria-current="page">Accounting & Finance</li>
            <li class="breadcrumb-item active" aria-current="page">Vouchers</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Vouchers
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('voucher.create')"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create"
                      @click="openModal()">
                Create Voucher<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="pending" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!vouchers?.data || vouchers.data.length === 0">
              <EmptyState />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th >Voucher Title.</th>
                  <th >Code</th>
                  <th >Accessibility</th>
                  <th >Amount</th>
                  <th >Validity</th>
                  <th >Remark</th>
                  <th >Status</th>
                  <th >Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(voucher, index) in vouchers?.data" :key="voucher.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ voucher.title }}</td>
                  <td>{{ voucher.code }}</td>
                  <td>
                    <div v-if="voucher.user_id">
                      <span class="badge bg-primary-gradient"> Exclusive for agency: {{voucher?.user?.name}}</span>
                    </div>
                    <div v-else>
                      <div class="d-flexx">
                        <span class="badge bg-primary-gradient">Public</span>
                      </div>
                    </div>
                  </td>

                  <td>{{ new Intl.NumberFormat('en-US').format(voucher.amount)  }} USD</td>
                  <td>
                    <div class="d-flex gap-1">
                      <div class="avatar avatar-md me-2">
                        <img  :src="voucher.createdBy.avatar ? `${config.public.fileBase}/${voucher.createdBy.avatar}` : '/dashboard-assets/images/authentication/user.png'"
                              class="rounded"
                              alt="Avatar">
                      </div>
                      <div>
                        <p class="mb-0 "><span class="badge bg-success-transparent">Created at: {{formatExpDate(voucher.created_at)}}</span></p>
                        <p class="mb-0 "><span class="badge bg-danger-transparent">Expires at: {{formatExpDate(voucher.expires_at)}}</span></p>
                        <p class="mb-0 "><span class="badge bg-primary-transparent">Created By: {{voucher.createdBy.name}}</span></p>
                      </div>
                    </div>
                  </td>
                  <td>{{voucher.remark}}</td>
                  <td>
                    <span
                          class="badge badge-lg rounded-pill cursor-pointer"
                          :class="[
                        voucher.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                        isLoadingId === voucher.id ? 'opacity-50' : ''
                      ]"
                          @click="() => toggleStatus(voucher)"
                          :style="{ pointerEvents: isLoadingId === voucher.id ? 'none' : 'auto' }"
                    >
                      <template v-if="isLoadingId === voucher.id">
                        Loading...
                      </template>
                      <template v-else>
                        {{ voucher.status === 1 ? 'Active' : 'Inactive' }}
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

                        <li v-if="auth.user.permissions.includes('voucher.update')"><a  @click="openModal(voucher)"
                               data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === voucher.id }" :style="{ pointerEvents: isLoadingId === voucher.id ? 'none' : 'auto' }" :data-role-id="voucher.id">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li ><nuxt-link
                            :to="`/dashboard/accountingFinance/vouchers/statement`"   class="dropdown-item modal-effect" >Statement</nuxt-link></li>
                        <li>
                          <hr class="dropdown-divider">
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
                      :class="{ disabled: vouchers.meta.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(vouchers.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in vouchers?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === vouchers?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: vouchers?.meta?.current_page === vouchers?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(vouchers.meta.current_page + 1)"
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
        aria-labelledby="createVoucherLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title" id="createVoucherLabel">Create Voucher</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"

                aria-label="Close"
            ></button>
          </div>

          <div class="modal-body text-start">
            <!-- Loader -->
            <div v-show="isLoadingModalData" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <form v-show="!isLoadingModalData" @submit.prevent="handleSubmit">
              <div class="row">
                <div  class="col-6 mb-4">
                  <div class="mb-2">
                    <label :for="`title`" class="form-label text-muted">Title</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors[`title`] }"
                        v-model="form.title"
                        :placeholder="`Enter Title `"
                    />
                    <div class="invalid-feedback" v-if="errors[`title`]">
                      {{ errors[`title`] }}
                    </div>
                  </div>
                </div>
                <div  class="col-6 mb-4">
                  <div class="mb-2">
                    <label :for="`title`" class="form-label text-muted">Code</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors[`code`] }"
                        v-model="form.code"
                        :placeholder="`Enter Code `"
                    />
                    <div class="invalid-feedback" v-if="errors[`code`]">
                      {{ errors[`code`] }}
                    </div>
                  </div>
                </div>
                <div class="col-6 mb-4">
                  <div class="mb-2">
                    <label for="last-version-update" class="form-label">Expires at</label>
                    <input
                        type="datetime-local"
                        class="form-control"
                        id="expires_at"
                        :class="{ 'is-invalid': errors[`expires_at`] }"
                        :placeholder="`Expires at `"

                        v-model="form.expires_at"
                    />
                    <div class="invalid-feedback" v-if="errors[`expires_at`]">
                      {{ errors[`expires_at`] }}
                    </div>
                  </div>
                </div>
                <div class="col-6 mb-4">
                  <div class="mb-2">
                    <label for="last-version-update" class="form-label">Redeemed at</label>
                    <input
                        type="text"
                        id="redeemed_at"
                        class="form-control flatpickr-input"
                        :class="{ 'is-invalid': errors[`redeemed_at`] }"
                        :placeholder="`Redeemed at `"
                        v-model="form.redeemed_at"
                    />
                    <div class="invalid-feedback" v-if="errors[`redeemed_at`]">
                      {{ errors[`redeemed_at`] }}
                    </div>
                  </div>
                </div>
                <div  class="col-6 mb-4">
                  <div class="mb-2">
                    <label :for="`title`" class="form-label text-muted">Amount</label>
                    <input
                        type="number"
                        class="form-control"
                        step="0.01"
                        min="0"
                        :class="{ 'is-invalid': errors[`amount`] }"
                        v-model="form.amount"
                        :placeholder="`Enter Amount `"
                    />
                    <div class="invalid-feedback" v-if="errors[`amount`]">
                      {{ errors[`amount`] }}
                    </div>
                  </div>
                </div>
                <div  class="col-6 mb-4">
                  <div class="mb-2">
                    <label :for="`title`" class="form-label text-muted">Remark</label>
                    <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors[`remark`] }"
                        v-model="form.remark"
                        :placeholder="`Enter Remark `"
                    />
                    <div class="invalid-feedback" v-if="errors[`remark`]">
                      {{ errors[`remark`] }}
                    </div>
                  </div>
                </div>
                <div class="col-6 mb-4">
                  <div class="mb-2">
                    <label for="show-price" class="form-label">Voucher Accessibility</label>
                    <div class="form-check">
                      <input
                          v-model="form.accessibility"
                          class="form-check-input"
                          type="radio"
                          name="accessibility"
                          id="accessibility_public"
                          value="0"
                          @change="onAccessibilityChange"

                      >
                      <label class="form-check-label" for="flexRadioDefault1">
                        Public
                      </label>
                    </div>

                    <div class="form-check">
                      <input
                          v-model="form.accessibility"
                          class="form-check-input"
                          type="radio"
                          name="accessibility"
                          id="accessibility_agency"
                          value="1"
                          @change="onAccessibilityChange"
                      >
                      <label class="form-check-label" for="flexRadioDefault2">
                        Exclusive for Agency
                      </label>
                    </div>

                  </div>
                </div>
                <div  class="col-md-6 mb-4" v-show="form.accessibility == 1">
                  <div class="mb-2">
                    <label for="show-price" class="form-label" :class="{ 'is-invalid': errors.accessibility }">User</label>
                    <select name="user_id"
                            placeholder="Please Select User"
                            class="choices-select"
                            v-model="form.user_id">
                      <option v-for="user in users?.data" :key="user?.id" :value="user?.id">
                        {{ user.name }} ({{ user.email }})
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.accessibility">
                      {{ errors.accessibility }}
                    </div>

                  </div>
                </div>

              </div>


              <div class="modal-footer">
                <button type="submit" :disabled="createVoucher" class="btn btn-primary" :class="{ 'opacity-50': createVoucher }">
                  {{ createVoucher ? 'Loading...' : (isEditMode ? 'Update Voucher' : 'Create Voucher') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createVoucher">Close</button>
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
            <p>Are you sure you want to delete voucher <strong>{{ voucherName }}</strong>?</p>
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
    <slot title="fallback">
      🚫 You do not have permission to view this section.
    </slot>
  </div>

</template>
<script setup>
import {ref, watch, reactive, onMounted } from 'vue'
const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('voucher.index') || false
})
definePageMeta({
  layout: 'dashboard',
})
useHead({
  title: 'Luxota Dashboard Panel',
  link: [
    {rel: 'stylesheet', href: '/dashboard-assets/css/select2.min.css'},
  ],
  script: [
    { src: '/dashboard-assets/libs/flatpickr/flatpickr.min.js',defer:true },
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
const isLoadingModalData = ref(false)
const isLoadingVouchers = ref(false)
const page = ref(1)
const perPage = ref(15)
const id = ref(null)
const isLoadingId = ref(null)
const form = reactive({
  title: '',
  code: '',
  expires_at: '',
  remark: '',
  amount: '',
  accessibility: '',
  user_id: '',
  redeemed_at: '',
})
const searchQuery = reactive({
  title: '',
  email: '',
  status: '',
  voucher_id: '',
})
const xsrfToken = useCookie('XSRF-TOKEN').value
const errors = reactive({})
const selectedVoucherId = ref(null)
const isDeleting = ref(false)
const currentVoucher = ref(false)
const isEditMode = ref(false)
const createVoucher = ref(false)
const currentRole = ref(null)
function setVoucher(id) {
  selectedVoucherId.value = id
}
const { data: vouchers, error, pending, refresh, clear } = useFetch(() => `/vouchers?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken.value || ''),
    Accept: 'application/json',
  },
  server: false
})
const { data: users, error : errorUsers, pending:pendingUsers, refresh:fetchUsers } = useFetch(() => `/users/search?status=1&role_id=1`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken.value || ''),
    Accept: 'application/json',
  },
  immediate: false,
})
const choicesInstances = {}
function formatExpDate(dateString) {
  if (!dateString) return ""

  const date = new Date(dateString)
  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month}, ${day}, ${year}`
}
function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  createVoucher.value = false

  title.value = null
  id.value = null
  isEditMode.value = false
  currentRole.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
function onAccessibilityChange(){
  if (form.accessibility == 0){
    form.user_id=null;
  }
}
function goToPage(newPage) {
  page.value = newPage
  refresh()
}
async function toggleStatus(voucher) {
  if (isLoadingId.value) return
  isLoadingId.value = voucher.id
  try {
    const response = await $fetch(`/vouchers/${voucher.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'POST',
      headers:{
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
        'Accept': 'application/json',

      }
    })
    voucher.status = voucher.status  === 1  ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}
function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  if (!form.title) {
    errors[`title`] = `Title is required.`
  }
  if (!form.code) {
    errors[`code`] = `Code is required.`
  }
  if (!form.expires_at) {
    errors[`expires_at`] = `Expiration date is required.`
  }
  if (!form.expires_at) {
    errors[`expires_at`] = `Expiration date is required.`
  }
  if (!form.redeemed_at) {
    errors[`redeemed_at`] = `Redeem date is required.`
  }
  if (!form.amount) {
    errors[`amount`] = `Amount is required.`
  }
  if (!form.remark) {
    errors[`remark`] = `Remark is required.`
  }
  if (form.accessibility) {
    if (!form.user_id){
      errors[`accessibility`] = `User is required.`
    }
  }
  return Object.keys(errors).length === 0
}
async function handleSubmit() {
  if (!validateForm()) return
  createVoucher.value = true
  const payload = new FormData()
  Object.keys(form).forEach(key => {
    if (form[key] !== '' && form[key] !== null) {
      payload.append(key, form[key])
    }
  })
  try {
    if (isEditMode.value && id) {
      const { data, error  } = await useFetch(`/vouchers/${id.value}`, {
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
      const { data, error } = await useFetch('/vouchers', {
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
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Vouchers ${isEditMode.value ? 'updated' : 'created' } successfully.`),
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
  isEditMode.value = false
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
function resetForm() {
  Object.keys(form).forEach(key => {
    if (Array.isArray(form[key])) {
      form[key] = []
    } else {
      form[key] = ''
    }
  })
  form.accessibility = 0
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

async function openModal(voucher = null) {
  isLoadingModalData.value=true
  resetForm()
  flatpickr("#expires_at", {});
  flatpickr("#redeemed_at", {});
  await fetchUsers()
  id.value = null
  isEditMode.value = false
  currentRole.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })

  if (voucher) {
    id.value = voucher.id
    Object.keys(form).forEach(key => {
      console.log()
      if (voucher[key] !== undefined) {
        if (voucher['user_id']){
           form.accessibility = 1;
        }
        form[key] = voucher[key]

      }
    })
    isEditMode.value = true
    currentVoucher.value = voucher
  }else{

  }
  initSelect()
  isLoadingModalData.value=false

}
async function confirmDeleteRole() {
  if (!selectedVoucherId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/voucher/${selectedVoucherId.value}`, {
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
      alert('Failed to delete voucher.')
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
    selectedVoucherId.value = null
  }
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

</script>


