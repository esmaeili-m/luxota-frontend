<!-- pages/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Categories</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="#">Main</a></li>
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
            <button @click="fetchLanguages" class="btn btn-sm btn-success-light mx-1 modal-effect" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">Create Category<i
                class="ri-add-line ms-2 d-inline-block align-middle"></i></button>
            <button class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingCategories" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
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
                <td >{{ index + 1 }}</td>
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
                      <li><a class="dropdown-item" href="javascript:void(0);">SubCategory </a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a class="dropdown-item" href="javascript:void(0);">Price Overview</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a class="dropdown-item" href="javascript:void(0);">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a class="dropdown-item" href="javascript:void(0);">Delete</a></li>

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
                      :class="{ 'is-invalid': errors[`titles.${language.id}`] }"
                      v-model="formData.titles[language.id]"
                      :placeholder="`Enter title for ${language.title}`"
                  />
                  <div class="invalid-feedback" v-if="errors[`titles.${language.id}`]">
                    {{ errors[`titles.${language.id}`] }}
                  </div>
                </div>

                <div>
                  <label :for="`subtitle-${language.id}`" class="form-label text-muted">Subtitle</label>
                  <input
                      type="text"
                      class="form-control"
                      :id="`subtitle-${language.id}`"
                      :class="{ 'is-invalid': errors[`subtitles.${language.id}`] }"
                      v-model="formData.subtitles[language.id]"
                      :placeholder="`Enter subtitle for ${language.title}`"
                  />
                  <div class="invalid-feedback" v-if="errors[`subtitles.${language.id}`]">
                    {{ errors[`subtitles.${language.id}`] }}
                  </div>
                </div>
              </div>
            </div>

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

            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Save changes</button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import {ref, watchEffect, reactive } from 'vue'
definePageMeta({
  layout: 'dashboard',
})

const config = useRuntimeConfig()
const isLoadingModalData = ref(false)
const isLoadingCategories = ref(false)
const imagePreview = ref(null)
const page = ref(1)
const categories = ref(null)
const languages = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const formData = reactive({
  titles: {},
  subtitles: {},
  image: null,
})

const errors = reactive({})
function closeModalAndResetForm() {
  // بستن مدال
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()

  // ریست کردن داده‌های فرم
  formData.image = null
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

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])

  languages.value.forEach(lang => {
    if (!formData.titles[lang.id]) {
      errors[`titles.${lang.id}`] = `Title (${lang.iso}) is required.`
    }
    if (!formData.subtitles[lang.id]) {
      errors[`subtitles.${lang.id}`] = `Subtitle (${lang.iso}) is required.`
    }
  })

  if (!formData.image) {
    errors.image = 'Image is required.'
  }

  return Object.keys(errors).length === 0
}
function preparePayload() {
  const title = {}
  const subtitles = {}

  languages.value.forEach(lang => {
    title[lang.iso] = {
      title: formData.titles[lang.id],
    }
    subtitles[lang.iso] = {
      subtitle: formData.subtitles[lang.id]
    }
  })

  return {
    image: formData.image,
    title:title,
    subtitle:subtitle,
  }
}
async function handleSubmit() {
  if (!validateForm()) return

  const payload = new FormData()
  const title = {}
  const subtitle = {}
  languages.value.forEach(lang => {
    title[lang.iso] = formData.titles[lang.id] || ''
    subtitle[lang.iso] = formData.subtitles[lang.id] || ''
  })
  Object.keys(title).forEach(lang => {
    payload.append(`title[${lang}]`, title[lang])
  })

  Object.keys(subtitle).forEach(lang => {
    payload.append(`subtitle[${lang}]`, subtitle[lang])
  })
  if (formData.image) {
    payload.append('image', formData.image)
  }
  try {
    await useFetch('/categories', {
      method: 'POST',
      body: payload,
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
      },
    })
    await fetchCategories()
    closeModalAndResetForm()
    Object.assign(formData.titles, {})
    Object.assign(formData.subtitles, {})
    formData.image = null
    imagePreview.value = null

  } catch (e) {
    console.error('Error sending data:', e)
  }
}





watchEffect(() => {
  fetchCategories()
})

async function fetchCategories() {
  error.value = null
  isLoadingCategories.value = true
  try {
    const { data: responseCategory } = await useFetch(`/categories?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    categories.value = responseCategory.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingCategories.value = false
  }
}

async function fetchLanguages() {
  if (languages.value === null) {
    isLoadingModalData.value = true
    try {
      const { data: responseLanguage } = await useFetch('/languages', {
        baseURL: config.public.apiBase
      })

      languages.value = responseLanguage.value.data

      languages.value.forEach(lang => {
        if (!(lang.id in formData.titles)) {
          formData.titles[lang.id] = ''
        }
        if (!(lang.id in formData.subtitles)) {
          formData.subtitles[lang.id] = ''
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
    })
    category.status = category.status  === 1  ? 0 : 1
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
  } finally {
    isLoadingId.value = null
  }
}
</script>


