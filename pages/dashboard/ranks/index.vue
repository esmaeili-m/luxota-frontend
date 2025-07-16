<!-- pages/index.vue -->
<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Ranks</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Ranks</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">
            Ranks
          </div>
          <div class="prism-toggle">
            <button
                    class="btn btn-sm btn-success-light mx-1 modal-effect"
                    data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create">
              Create Rank<i class="ri-add-line ms-2 d-inline-block align-middle"></i>
            </button>
            <NuxtLink to="/dashboard/ranks/trash" class="btn btn-sm btn-warning-light">Trash<i
                class="ri-delete-bin-line ms-2 d-inline-block align-middle"></i></NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingRanks" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>
          <div v-else-if="!ranks?.data || ranks.data.length === 0">
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
              <tr v-for="(rank, index) in ranks?.data" :key="rank.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ rank.title }}</td>
                <td>
                    <span
                        class="badge badge-lg rounded-pill cursor-pointer"
                        :class="[
                      rank.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent',
                      isLoadingId === rank.id ? 'opacity-50' : ''
                    ]"
                        @click="() => toggleStatus(rank)"
                        :style="{ pointerEvents: isLoadingId === rank.id ? 'none' : 'auto' }"
                    >
                    <template v-if="isLoadingId === rank.id">
                      Loading...
                    </template>
                    <template v-else>
                      {{ rank.status === 1 ? 'Active' : 'Inactive' }}
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
                      <li><a @click="openModal(rank)"
                             data-bs-target="#create" data-bs-effect="effect-flip-vertical" data-bs-toggle="modal" href="#create" class="dropdown-item modal-effect" :class="{ 'disabled': isLoadingId === rank.id }" :style="{ pointerEvents: isLoadingId === rank.id ? 'none' : 'auto' }">Update</a></li>
                      <li>
                        <hr class="dropdown-divider">
                      </li>
                      <li><a data-bs-toggle="modal" data-bs-effect="effect-flip-vertical" data-bs-target="#delete"  @click="setRank(rank.id)" class="dropdown-item modal-effect" href="#delete" :class="{ 'disabled': isLoadingId === rank.id }" :style="{ pointerEvents: isLoadingId === rank.id ? 'none' : 'auto' }">Delete</a></li>
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
                    :class="{ disabled: ranks?.meta?.current_page === 1 }"
                >
                  <a
                      class="page-link"
                      href="#"
                      @click.prevent="goToPage(ranks.meta.current_page - 1)"
                  >
                    Prev
                  </a>
                </li>
                <li
                    v-for="pageNumber in ranks?.meta?.last_page"
                    :key="pageNumber"
                    class="page-item"
                    :class="{ active: pageNumber === ranks?.meta?.current_page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>
                <li
                    class="page-item"
                    :class="{ disabled: ranks?.meta?.current_page === ranks?.meta?.last_page }"
                >
                  <a
                      class="page-link text-primary"
                      href="#"
                      @click.prevent="goToPage(ranks.meta.current_page + 1)"
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
      aria-labelledby="createRankLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createRankLabel">Create Rank</h5>
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
              <button type="submit" :disabled="createRank" class="btn btn-primary" :class="{ 'opacity-50': createRank }">
                {{ createRank ? 'Loading...' : (isEditMode ? 'Update Rank' : 'Create Rank') }}
              </button>
              <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="createRank">Close</button>
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
          <h5 class="modal-title" id="deleteModalLabel">Delete Rank</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete rank <strong>{{ rankName }}</strong>?</p>
          <p class="text-danger">Warning: Deleting this Rank will also delete all its related data.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isDeleting">Cancel</button>
          <button
              :disabled="isDeleting"
              type="button"
              class="btn btn-danger"
              :class="{ 'opacity-50': isDeleting }"
              @click="confirmDeleteRank"
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
const isLoadingRanks = ref(false)
const page = ref(1)
const perPage = ref(15)
const ranks = ref(null)
const title = ref(null)
const id = ref(null)
const error = reactive({})
const isLoadingId = ref(null)
const errors = reactive({})
const selectedRankId = ref(null)
const isDeleting = ref(false)
const createRank = ref(false)
const rankName = ref('')

function setRank(id) {
  selectedRankId.value = id
  const rank = ranks.value.data.find(r => r.id === id)
  rankName.value = rank ? rank.title : ''
}

function closeModalAndResetForm() {
  const modalEl = document.getElementById('create')
  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
  modal.hide()
  title.value = null
  id.value = null
  isEditMode.value = false
  currentRank.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

watchEffect(() => {
  fetchRanks()
})

async function fetchRanks() {
  error.value = null
  isLoadingRanks.value = true
  try {
    const { data: responseRank } = await useFetch(`/ranks?page=${page.value}`, {
      baseURL: config.public.apiBase
    })
    ranks.value = responseRank.value
  } catch (e) {
    error.value = e
  } finally {
    isLoadingRanks.value = false
  }
}

function goToPage(newPage) {
  page.value = newPage
}

async function toggleStatus(rank) {
  if (isLoadingId.value) return
  isLoadingId.value = rank.id
  try {
    const response = await $fetch(`/ranks/${rank.id}/toggle-status`, {
      baseURL: config.public.apiBase,
      method: 'POST',
    })
    rank.status = rank.status === 1 ? 0 : 1
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
  createRank.value = true
  const payload = new FormData()
  payload.append(`title`, title.value)

  try {
    if (isEditMode.value && id.value) {
      await $fetch(`/ranks/${id.value}`, {
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
        message: 'Rank updated successfully.',
        type: 'success',
        duration: 3000
      })
    } else {
      await useFetch('/ranks', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        },
      })
      nuxtApp.$toast({
        title: 'success!',
        message: 'Rank created successfully.',
        type: 'success',
        duration: 3000
      })
    }
    createRank.value = false
    await fetchRanks()
    closeModalAndResetForm()
    title.value = null
  } catch (e) {
    console.error('Error sending data:', e)
  }
}

function resetData(){
  title.value = null
  id.value = null
  isEditMode.value = false
  currentRank.value = null
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
}

const isEditMode = ref(false)
const currentRank = ref(null)

function openModal(rank = null) {
  if (rank) {
    id.value = rank.id
    isEditMode.value = true
    currentRank.value = rank
    title.value = rank.title
  } else {
    id.value = null
    isEditMode.value = false
    currentRank.value = null
    title.value = null
  }
}

async function confirmDeleteRank() {
  if (!selectedRankId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/ranks/${selectedRankId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json' },
    })
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()

    if (error.value) {
      alert('Failed to delete rank.')
      console.error(error.value)
      return
    }
    nuxtApp.$toast({
      title: 'success!',
      message: 'Rank moved to trash.',
      type: 'success',
      duration: 3000
    })
    await fetchRanks()
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedRankId.value = null
  }
}
</script> 