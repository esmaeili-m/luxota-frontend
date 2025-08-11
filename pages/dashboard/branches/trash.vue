<!-- pages/index.vue -->
<template>
  <div v-if="!auth.user"></div>
  <div v-else-if="hasPermission">
    <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
      <h1 class="page-title fw-semibold fs-18 mb-0">Trashed Branches</h1>
      <div class="ms-md-1 ms-0">
        <nav>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><nuxt-link to="/dashboard/branches">Branches</nuxt-link></li>
            <li class="breadcrumb-item active" aria-current="page">Trashed Branches</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">
              Trash Branches
            </div>
            <div class="prism-toggle">
              <NuxtLink to="/dashboard/branches" class="btn btn-sm btn-primary-light">Back to Branches<i
                  class="ri-arrow-left-line ms-2 d-inline-block align-middle"></i></NuxtLink>
            </div>
          </div>
          <div class="card-body">
            <div v-if="isLoadingBranches" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading</span>
              </div>
            </div>
            <div v-else-if="!branches?.data || branches.data.length === 0">
              <EmptyState icon-class="ri-delete-bin-line" />
            </div>
            <div v-else class="table-responsive">
              <table class="table text-nowrap">
                <thead class="table-primary">
                <tr>
                  <th class="col-width-100">#</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(branch, index) in branches?.data" :key="branch.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ branch.title }}</td>
                  <td>
                    <div class="btn-group my-1">
                      <button type="button" class="btn btn-sm btn-light">...</button>
                      <button type="button"
                              class="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split me-2"
                              data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="visually-hidden">Toggle Dropdown</span>
                      </button>
                      <ul class="dropdown-menu">
                        <li v-if="auth.user.permissions.includes('branch.restore')"><a
                            class="dropdown-item modal-effect" @click="restoreBranch(branch.id)"
                            href="javascript:void(0);">Restore</a></li>
                        <li v-if="auth.user.permissions.includes('branch.delete')"><a data-bs-effect="effect-flip-vertical"  data-bs-toggle="modal" data-bs-target="#delete" class="dropdown-item modal-effect" @click="setBranch(branch.id)" href="javascript:void(0);">Delete</a></li>
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
                      :class="{ disabled: branches?.meta?.current_page === 1 }"
                  >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(branches.meta.current_page - 1)"
                    >
                      Prev
                    </a>
                  </li>
                  <li
                      v-for="pageNumber in branches?.meta?.last_page"
                      :key="pageNumber"
                      class="page-item"
                      :class="{ active: pageNumber === branches?.meta?.current_page }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                      {{ pageNumber }}
                    </a>
                  </li>
                  <li
                      class="page-item"
                      :class="{ disabled: branches?.meta?.current_page === branches?.meta?.last_page }"
                  >
                    <a
                        class="page-link text-primary"
                        href="#"
                        @click.prevent="goToPage(branches.meta.current_page + 1)"
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
    <div class="modal fade" id="delete" data-bs-backdrop="static"
         data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title" id="deleteModalLabel">Delete Branch</h6>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this branch?</p>
            <p class="text-danger mb-0">Warning: Deleting this branch will also delete all its related data.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
                :disabled="isDeleting"
                type="button"
                class="btn btn-danger"
                :class="{ 'opacity-50': isDeleting }"
                @click="confirmDeleteBranch"
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
definePageMeta({
  layout: 'dashboard',
})
const nuxtApp = useNuxtApp()
const xsrfToken = useCookie('XSRF-TOKEN').value
const auth = useAuthStore()
const config = useRuntimeConfig()
const selectedBranchId = ref(null)
const isDeleting = ref(false)
const isLoadingId = ref(false)
const hasPermission = computed(() => {
  return auth.user?.permissions?.includes('branch.trash') || false
})

function setBranch(id) {
  selectedBranchId.value = id
}

const { data: branches, pending: isLoadingBranches, error, refresh: reloadBranches } = await useAsyncData(
    'branches-trash',
    () =>
        $fetch('/branches/trash', {
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
          },
        })
)

async function confirmDeleteBranch() {
  if (!selectedBranchId.value) return
  isDeleting.value = true
  try {
    const { error } = await useFetch(`/branches/force-delete/${selectedBranchId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
      },
    })
    if (error.value) {
      alert('Failed to delete branch.')
      console.error(error.value)
      return
    }
    const modalEl = document.getElementById('delete')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()
    reloadBranches()
    nuxtApp.$toast({
      title: 'success!',
      message: 'Branch Deleted successfully.',
      type: 'success',
      duration: 3000
    })
  } catch (e) {
    console.error(e)
    alert('An error occurred during deletion.')
  } finally {
    isDeleting.value = false
    selectedBranchId.value = null
  }
}

async function restoreBranch(branchId) {
  try {
    isLoadingId.value = branchId;
    await $fetch(`/branches/${branchId}/restore`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
      },
    });
    nuxtApp.$toast({
      title: 'success!',
      message: 'Branch Restore successfully.',
      type: 'success',
      duration: 3000
    })
    reloadBranches()
  } catch (error) {
    console.error('Error restoring branch:', error);
  } finally {
    isLoadingId.value = null;
  }
}
</script> 