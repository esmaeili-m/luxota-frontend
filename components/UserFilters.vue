<template>
  <div class="card custom-card mb-3">
    <div class="card-body">
      <h6 class="card-title mb-3">
        <i class="bx bx-filter-alt me-2"></i>
        Filters & Search
      </h6>
      
      <div class="row">
        <div class="col-md-3 mb-2">
          <label class="form-label small text-muted">Name</label>
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="filters.name"
            placeholder="Search by name..."
            @input="debounceSearch"
          />
        </div>
        
        <div class="col-md-3 mb-2">
          <label class="form-label small text-muted">Email</label>
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="filters.email"
            placeholder="Search by email..."
            @input="debounceSearch"
          />
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Phone</label>
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="filters.phone"
            placeholder="Search by phone..."
            @input="debounceSearch"
          />
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Status</label>
          <select class="form-select form-select-sm" v-model="filters.status" @change="debounceSearch">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Role</label>
          <select class="form-select form-select-sm" v-model="filters.role_id" @change="debounceSearch">
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.title }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Zone</label>
          <select class="form-select form-select-sm" v-model="filters.zone_id" @change="onZoneChange">
            <option value="">All Zones</option>
            <option v-for="zone in zones" :key="zone.id" :value="zone.id">
              {{ zone.name }}
            </option>
          </select>
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">City</label>
          <select class="form-select form-select-sm" v-model="filters.city_id" @change="debounceSearch">
            <option value="">All Cities</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Rank</label>
          <select class="form-select form-select-sm" v-model="filters.rank_id" @change="debounceSearch">
            <option value="">All Ranks</option>
            <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
              {{ rank.title }}
            </option>
          </select>
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Branch</label>
          <select class="form-select form-select-sm" v-model="filters.branch_id" @change="debounceSearch">
            <option value="">All Branches</option>
            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>
        </div>
        
        <div class="col-md-2 mb-2">
          <label class="form-label small text-muted">Country Code</label>
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="filters.country_code"
            placeholder="e.g., IR"
            @input="debounceSearch"
          />
        </div>
        
        <div class="col-md-2 mb-2 d-flex align-items-end">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="clearFilters">
            <i class="bx bx-reset me-1"></i>
            Clear
          </button>
          <button class="btn btn-sm btn-primary" @click="exportResults">
            <i class="bx bx-export me-1"></i>
            Export
          </button>
        </div>
      </div>
      
      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-3">
        <div class="d-flex flex-wrap gap-2">
          <span class="badge bg-primary-transparent">
            Active Filters:
          </span>
          <span 
            v-for="(value, key) in activeFilters" 
            :key="key"
            class="badge bg-info-transparent"
          >
            {{ getFilterLabel(key, value) }}
            <i 
              class="bx bx-x ms-1 cursor-pointer" 
              @click="removeFilter(key)"
            ></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  },
  zones: {
    type: Array,
    default: () => []
  },
  cities: {
    type: Array,
    default: () => []
  },
  ranks: {
    type: Array,
    default: () => []
  },
  branches: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'export'])

// Reactive filters
const filters = ref({
  name: '',
  email: '',
  phone: '',
  status: '',
  role_id: '',
  zone_id: '',
  city_id: '',
  rank_id: '',
  branch_id: '',
  country_code: ''
})

// Debounced search
let searchTimeout
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', { ...filters.value })
  }, 500)
}

// Computed properties
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '')
})

const activeFilters = computed(() => {
  const active = {}
  Object.entries(filters.value).forEach(([key, value]) => {
    if (value !== '') {
      active[key] = value
    }
  })
  return active
})

// Methods
const clearFilters = () => {
  Object.keys(filters.value).forEach(key => {
    filters.value[key] = ''
  })
  emit('search', { ...filters.value })
}

const removeFilter = (key) => {
  filters.value[key] = ''
  emit('search', { ...filters.value })
}

const onZoneChange = () => {
  // Reset city when zone changes
  filters.value.city_id = ''
  emit('search', { ...filters.value })
}

const exportResults = () => {
  emit('export', { ...filters.value })
}

const getFilterLabel = (key, value) => {
  const labels = {
    name: `Name: ${value}`,
    email: `Email: ${value}`,
    phone: `Phone: ${value}`,
    status: `Status: ${value === '1' ? 'Active' : 'Inactive'}`,
    role_id: `Role: ${props.roles.find(r => r.id == value)?.title || value}`,
    zone_id: `Zone: ${props.zones.find(z => z.id == value)?.name || value}`,
    city_id: `City: ${props.cities.find(c => c.id == value)?.name || value}`,
    rank_id: `Rank: ${props.ranks.find(r => r.id == value)?.title || value}`,
    branch_id: `Branch: ${props.branches.find(b => b.id == value)?.name || value}`,
    country_code: `Country: ${value}`
  }
  return labels[key] || `${key}: ${value}`
}

// Watch for prop changes to update cities when zones change
watch(() => props.zones, (newZones) => {
  if (filters.value.zone_id && !newZones.find(z => z.id == filters.value.zone_id)) {
    filters.value.zone_id = ''
    filters.value.city_id = ''
  }
}, { deep: true })
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.badge {
  font-size: 0.75rem;
}

.form-control-sm, .form-select-sm {
  font-size: 0.875rem;
}
</style> 