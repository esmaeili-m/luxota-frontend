<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Categories</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item active" aria-current="page">Categories</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Categories
            </div>
            <div class="prism-toggle">
              <button v-if="auth.user.permissions.includes('category.create')" @click="fetchLanguages"
                      class="btn btn-sm btn-success-light mx-1 modal-effect"
                      data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
                Create Category<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
              </button>
              <NuxtLink v-if="auth.user.permissions.includes('category.trash')" to="/dashboard/categories/trash" class="btn btn-sm btn-warning-light">Trash<i
                  class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingCategories" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!categories?.data || categories.data.length === 0">
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
                <tr v-for="(category, index) in categories?.data" :key="category.id">
                  <td>{{ (page - 1) * perPage + index + 1 }}</td>
                  <td>{{ category.title.en }}</td>
                  <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      category.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === category.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(category)"
                        :style="{ pointerEvents: isLoadingId === category.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === category.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ category.status === 1 ? 'Active' : 'Inactive' }}
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
                        <li v-if="auth.user.permissions.includes('category.index')"><nuxt-link :to="`/dashboard/categories/${category.id}`" class="dropdown-item" href="javascript:void(0);">SubCategory </nuxt-link></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('category.price')"><a class="dropdown-item" href="javascript:void(0);">Price Overview</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('category.create')"><a @click="openModal(category)"
                                                                                        data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === category.id }" :style="{ pointerEvents: isLoadingId === category.id ? 'none' : 'auto' }">Update</a></li>
                        <li>
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="auth.user.permissions.includes('category.delete')"><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setCategory(category.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === category.id }" :style="{ pointerEvents: isLoadingId === category.id ? 'none' : 'auto' }">Delete</a></li>

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
                      :class="{ disabled: categories?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(categories.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>

                  <li
                      v-for="pageNumber in categories?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === categories?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>

                  <li
                      class="page-item"
                      :class="{ disabled: categories?.meta?.current_page === categories?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(categories.meta.current_page + 1)"
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
        aria-labelledby="createCategoryLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createCategoryLabel">Create Category</h5>
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
                <div v-for="language in languages" :key="language.id" class="col-12 mb-4">
                  <p class="fw-bold text-primary mb-2">{{ language.title }}</p>

                  <div class="mb-2">
                    <label :for="`title-${language.id}`" class="form-label text-muted">Title</label>
                    <input
                        type="text"
                        class="form-control"
                        :id="`title-${language.id}`"
                        :class="{ 'is-invalid': errors[`titles.${language.iso}`] }"
                        v-model="formData.titles[language.iso]"
                        :placeholder="`Enter title for ${language.title}`"
                    />
                    <div class="invalid-feedback" v-if="errors[`titles.${language.iso}`]">
                      {{ errors[`titles.${language.iso}`] }}
                    </div>
                  </div>

                  <div>
                    <label :for="`subtitle-${language.id}`" class="form-label text-muted">Subtitle</label>
                    <input
                        type="text"
                        class="form-control"
                        :id="`subtitle-${language.id}`"
                        :class="{ 'is-invalid': errors[`subtitles.${language.iso}`] }"
                        v-model="formData.subtitles[language.iso]"
                        :placeholder="`Enter subtitle for ${language.title}`"
                    />
                    <div class="invalid-feedback" v-if="errors[`subtitles.${language.iso}`]">
                      {{ errors[`subtitles.${language.iso}`] }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="category-order" class="form-label">Order</label>
                    <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': errors.order }"
                        id="category-order"
                        v-model="formData.order"
                        placeholder="Enter order number"
                        min="1"
                    />
                    <div class="invalid-feedback" v-if="errors.order">
                      {{ errors.order }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="category-image" class="form-label">Image</label>
                    <input
                        id="category-image"
                        type="file"
                        accept="image/*"
                        @change="previewImage"
                        :class="{ 'is-invalid': errors.image }"
                        class="form-control"
                    />
                    <div class="invalid-feedback" v-if="errors.image">
                      {{ errors.image }}
                    </div>
                    <div v-if="imagePreview" class="mt-3 text-center">
                      <img :src="imagePreview" alt="Preview" class="img-thumbnail rounded" style="max-width: 300px;" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="submit" :disabled="createCategory" class="btn btn-primary" :class="{ 'opacity-50': createCategory }">
                  {{ createCategory ? 'Loading...' : (isEditMode ? 'Update Category' : 'Create Category') }}
                </button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createCategory">Close</button>
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Category</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete category <strong>{{ categoryName }}</strong>?</p>
            <p class="text-danger">Warning: Deleting this category will also delete all its subcategories.</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteCategory"
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
import {ref, reactive } from 'vue'
const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const config = useRuntimeConfig()
const xsrfToken = useCookie('XSRF-TOKEN').value
definePageMeta({
  layout: 'dashboard',
})
const isLoadingModalData = ref(false)
const imagePreview = ref(null)
const page = ref(1)
const perPage = ref(15)
const languages = ref(null)
const isLoadingId = ref(null)
const formData = reactive({
  titles: {},
  subtitles: {},
  order: '',
  image: null,
})
const errors = reactive({})
const selectedCategoryId = ref(null)
const isDeleting = ref(false)
const createCategory = ref(false)
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('category.index') || false
})
const { data: categories, error, pending: isLoadingCategories, refresh: fetchCategories, clear } = useFetch(() => `/categories?page=${page.value}`, {
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
    Accept: 'application/json',
  }
})

function setCategory(id) {
  selectedCategoryId.value = id
}
function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  formData.image = null
  Object.assign(formData.titles, {})
  Object.assign(formData.subtitles, {})
  formData.order = ''
  imagePreview.value = null
  Object.keys(formData.titles).forEach(key => {
    formData.titles[key] = ''
  })
  Object.keys(formData.subtitles).forEach(key => {
    formData.subtitles[key] = ''
  })

  // پاک کردن خطاها (در صورت وجود)
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })

  // در صورت استفاده از <input type="file"> باید مقدار فیزیکی هم ریست شود
  const fileInput = document.getElementById('category-image')
  if (fileInput) fileInput.value = ''
}
async function fetchLanguages() {
  resetData()
  if (languages.value === null) {
    isLoadingModalData.value = true
    try {
      const { data: responseLanguage } = await useFetch('/languages', {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers :{
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
          Accept: 'application/json',
        }
      })

      languages.value = responseLanguage.value.data
      languages.value.forEach(lang => {
        if (!(lang.iso in formData.titles)) {
          formData.titles[lang.iso] = ''
        }
        if (!(lang.iso in formData.subtitles)) {
          formData.subtitles[lang.iso] = ''
        }
      })
    } catch (e) {
      console.error('خطا در گرفتن زبان‌ها:', e)
    } finally {
      isLoadingModalData.value = false
    }
  }
}
function goToPage(newPage) {
  page.value = newPage
  fetchCategories()
}
function previewImage(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imagePreview.value = URL.createObjectURL(file)
    formData.image = file
  } else {
    imagePreview.value = null
  }
}
async function toggleStatus(category) {
  if (isLoadingId.value) return
  isLoadingId.value = category.id
  try {
    const response = await $fetch(`/categories/${category.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

      }
    })
    category.status = category.status  === 1  ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}
function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])

  languages.value.forEach(lang => {
    if (!formData.titles[lang.iso]) {
      errors[`titles.${lang.iso}`] = `Title (${lang.iso}) is required.`
    }
    if (!formData.subtitles[lang.iso]) {
      errors[`subtitles.${lang.iso}`] = `Subtitle (${lang.iso}) is required.`
    }
  })

  if (!formData.image) {
    errors.image = 'Image is required.'
  }

  return Object.keys(errors).length === 0
}
async function handleSubmit() {
  if (!validateForm()) return
  createCategory.value = true
  const payload = new FormData()
  const title = {}
  const subtitle = {}
  languages.value.forEach(lang => {
    title[lang.iso] = formData.titles[lang.iso] || ''
    subtitle[lang.iso] = formData.subtitles[lang.iso] || ''
  })
  Object.keys(title).forEach(lang => {
    payload.append(`title[${lang}]`, title[lang])
  })

  Object.keys(subtitle).forEach(lang => {
    payload.append(`subtitle[${lang}]`, subtitle[lang])
  })
  if (formData.order) {
    payload.append('order', formData.order);
  }
  if (formData.image instanceof File) {
    payload.append('image', formData.image);
  }
  var response

  try {
    if (isEditMode.value && formData.id) {
      response= await $fetch(`/categories/${formData.id}`, {
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
        response= await useFetch('/categories', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),

        }
      })
    }
    if (response?.error?.value) {
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
      createCategory.value = false
      return
    }
    nuxtApp.$toast({
      title: error.value ? 'Error!' : 'Success!',
      message: error.value?.message || (error.value ? 'Something went wrong.' : `Role ${isEditMode.value ? 'updated' : 'created'} successfully.`),
      type: error.value ? 'error' : 'success',
      duration: 3000
    })
    await fetchCategories()
    closeModalAndResetForm()

  } catch (e) {
    console.error('Error sending data:', e)
  }
}
function resetData(){
  formData.image = null
  formData.order = ''
  imagePreview.value = null
  Object.keys(formData.titles).forEach(key => {
    formData.titles[key] = ''
  })
  Object.keys(formData.subtitles).forEach(key => {
    formData.subtitles[key] = ''
  })

  // پاک کردن خطاها (در صورت وجود)
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}
const isEditMode = ref(false)
const currentCategory = ref(null)
function openModal(category = null) {
  fetchLanguages()
  if (category) {
    formData.id = category.id
    isEditMode.value = true
    currentCategory.value = category

    Object.keys(category.title).forEach(lang => {
      formData.titles[lang] = category.title[lang]
    })

    Object.keys(category.subtitle).forEach(lang => {
      formData.subtitles[lang] = category.subtitle[lang]
    })

    formData.order = category.order || ''
    imagePreview.value = `${config.public.fileBase}/${category.image}`;
    formData.image = category.image;
  } else {
    isEditMode.value = false
    currentCategory.value = null
  }

  // باز کردن مدا
}
async function confirmDeleteCategory() {
  if (!selectedCategoryId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/categories/${selectedCategoryId.value}`, {
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
      alert('Failed to delete category.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Category moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchCategories()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedCategoryId.value = null
  }
}

</script>


