<template>
  <div class="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
    <h1 class="page-title fw-semibold fs-18 mb-0">Activity Log</h1>
    <div class="ms-md-1 ms-0">
      <nav>
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item active" aria-current="page">Activity Log</li>
        </ol>
      </nav>
    </div>
  </div>

  <div class="row">
    <div class="col-xl-12">
      <div class="card custom-card">
        <div class="card-header justify-content-between">
          <div class="card-title">Activity Log</div>
        </div>
        <div class="card-body">
          <div v-if="isLoadingLogs" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading</span>
            </div>
          </div>

          <div v-else-if="!logs?.data?.length">
            <EmptyState />
          </div>

          <div v-else class="table-responsive">
            <table class="table text-nowrap">
              <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Log Name</th>
                <th>Description</th>
                <th>Event</th>
                <th>User</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(log, index) in logs.data" :key="log.id">
                <td>{{ (page - 1) * perPage + index + 1 }}</td>
                <td>{{ log.log_name }}</td>
                <td>{{ log.description }}</td>
                <td><span class="badge badge-lg rounded-pill cursor-pointer bg-info-transparent">{{ log.event }}</span></td>
                <td>{{ log.user?.name || '—' }}</td>
                <td>{{ formatDate(log.created_at) }}</td>
                <td>
                  <button
                      class="btn btn-sm btn-outline-primary"
                      @click="viewLog(log)"
                      data-bs-toggle="modal"
                      data-bs-target="#logModal"
                  >
                    Data
                  </button>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <nav aria-label="Page navigation" class="pagination-style-4 mt-2">
              <ul class="pagination mb-0 flex-wrap">
                <li class="page-item" :class="{ disabled: logs.meta.current_page === 1 }">
                  <a class="page-link" href="#" @click.prevent="goToPage(logs.meta.current_page - 1)">Prev</a>
                </li>
                <li v-for="pageNumber in logs.meta.last_page" :key="pageNumber"
                    :class="{ active: pageNumber === logs.meta.current_page }" class="page-item">
                  <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: logs.meta.current_page === logs.meta.last_page }">
                  <a class="page-link" href="#" @click.prevent="goToPage(logs.meta.current_page + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="logModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Log Details — <span class="text-primary text-capitalize">{{ eventLog }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body" v-if="selectedLog">
          <div v-if="eventLog === 'updated'" class="row">
            <div class="col-md-6" v-if="selectedLog?.old">
              <h6 class="text-muted mb-2">Before</h6>
              <div
                  v-for="(value, key) in selectedLog.old"
                  :key="'old-' + key"
                  class="mb-3 p-3 border rounded bg-light"
              >
                <strong class="text-muted">{{ key }}</strong>
                <div class="text-danger">{{ value }}</div>
              </div>
            </div>
            <div class="col-md-6" v-if="selectedLog?.attributes">
              <h6 class="text-muted mb-2">After</h6>
              <div
                  v-for="(value, key) in selectedLog.attributes"
                  :key="'new-' + key"
                  class="mb-3 p-3 border rounded bg-light"
              >
                <strong class="text-muted">{{ key }}</strong>
                <div class="text-success">{{ value }}</div>
              </div>
            </div>
          </div>

          <div v-else-if="eventLog === 'created'" class="row">
            <div class="col-md-12" v-if="selectedLog?.attributes">
              <h6 class="text-muted mb-2">Created Data</h6>
              <div
                  v-for="(value, key) in selectedLog.attributes"
                  :key="'created-' + key"
                  class="mb-3 p-3 border rounded bg-light"
              >
                <strong class="text-muted">{{ key }}</strong>
                <div class="text-success">{{ value }}</div>
              </div>
            </div>
          </div>

          <div v-else-if="eventLog === 'deleted'" class="row">
            <div class="col-md-12" v-if="selectedLog?.attributes">
              <h6 class="text-muted mb-2">Deleted Data</h6>
              <div
                  v-for="(value, key) in selectedLog.attributes"
                  :key="'deleted-' + key"
                  class="mb-3 p-3 border rounded bg-light"
              >
                <strong class="text-muted">{{ key }}</strong>
                <div class="text-danger">{{ value }}</div>
              </div>
            </div>
          </div>

          <div v-else class="text-muted">
            No detailed data available for this log.
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref, onMounted} from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const config = useRuntimeConfig()
const isLoadingLogs = ref(false)
const logs = ref([])
const page = ref(1)
const perPage = ref(15)
const selectedLog = ref(null)

async function fetchLogs() {
  isLoadingLogs.value = true
  try {
    const {data: response} = await useFetch(`/activity-log?page=${page.value}`, {
      baseURL: config.public.apiBase,
    })
    logs.value = response.value
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingLogs.value = false
  }
}
const eventLog=ref(null)
function viewLog(log) {
  eventLog.value=log.event
  selectedLog.value = formatJson(log.data)

}

function goToPage(newPage) {
  page.value = newPage
  fetchLogs()
}

function formatJson(data) {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data
      return  JSON.parse(JSON.stringify(parsed, null, 2))
    } catch (e) {
      return 'Invalid JSON'
    }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchLogs)
</script>
