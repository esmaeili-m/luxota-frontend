<template>
  <div class="card custom-card">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <div class="avatar avatar-lg me-3">
          <img v-if="user.avatar" :src="user.avatar" class="rounded-circle" alt="Avatar">
          <div v-else class="avatar-initials rounded-circle bg-primary text-white">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="flex-grow-1">
          <h5 class="mb-1">{{ user.name }}</h5>
          <p class="text-muted mb-0">{{ user.email }}</p>
          <div class="mt-1">
            <span class="badge bg-info-transparent me-1">{{ user.role?.title }}</span>
            <span class="badge bg-success-transparent">{{ user.rank?.title }}</span>
          </div>
        </div>
        <div class="text-end">
          <span
            class="badge badge-lg rounded-pill cursor-pointer"
            :class="user.status === 1 ? 'bg-success-transparent' : 'bg-danger-transparent'"
          >
            {{ user.status === 1 ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Phone:</small>
            <div>{{ user.phone }}</div>
          </div>
          <div class="mb-2">
            <small class="text-muted">Location:</small>
            <div>{{ user.city?.name }}, {{ user.zone?.name }}</div>
          </div>
          <div class="mb-2">
            <small class="text-muted">Branch:</small>
            <div>{{ user.branch?.name }}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <small class="text-muted">Referrer:</small>
            <div>{{ user.referrer?.name || 'N/A' }}</div>
          </div>
          <div class="mb-2">
            <small class="text-muted">Parent:</small>
            <div>{{ user.parent?.name || 'N/A' }}</div>
          </div>
          <div class="mb-2">
            <small class="text-muted">Country Code:</small>
            <div>{{ user.country_code || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <div v-if="user.description" class="mb-3">
        <small class="text-muted">Description:</small>
        <p class="mb-0">{{ user.description }}</p>
      </div>

      <div v-if="user.address" class="mb-3">
        <small class="text-muted">Address:</small>
        <p class="mb-0">{{ user.address }}</p>
      </div>

      <div v-if="user.website" class="mb-3">
        <small class="text-muted">Website:</small>
        <div>
          <a v-if="user.website.website" :href="user.website.website" target="_blank" class="me-2">
            <i class="bx bx-globe"></i> Website
          </a>
          <a v-if="user.website.instagram" :href="`https://instagram.com/${user.website.instagram}`" target="_blank" class="me-2">
            <i class="bx bxl-instagram"></i> Instagram
          </a>
          <a v-if="user.website.telegram" :href="`https://t.me/${user.website.telegram}`" target="_blank">
            <i class="bx bxl-telegram"></i> Telegram
          </a>
        </div>
      </div>

      <div v-if="user.luxota_website" class="mb-3">
        <small class="text-muted">Luxota Website:</small>
        <div>
          <a :href="user.luxota_website" target="_blank">
            <i class="bx bx-link"></i> {{ user.luxota_website }}
          </a>
        </div>
      </div>

      <div v-if="user.whatsapp_number" class="mb-3">
        <small class="text-muted">WhatsApp:</small>
        <div>
          <a :href="`https://wa.me/${user.whatsapp_number}`" target="_blank">
            <i class="bx bxl-whatsapp"></i> {{ user.whatsapp_number }}
          </a>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-muted">
          Created: {{ formatDate(user.created_at) }}
        </small>
        <div v-if="showActions" class="btn-group">
          <button 
            class="btn btn-sm btn-outline-primary"
            @click="$emit('edit', user)"
          >
            <i class="bx bx-edit"></i> Edit
          </button>
          <button 
            class="btn btn-sm btn-outline-danger"
            @click="$emit('delete', user)"
          >
            <i class="bx bx-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.avatar {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-weight: bold;
  font-size: 24px;
}

.cursor-pointer {
  cursor: pointer;
}

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 