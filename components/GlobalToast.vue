<template>
  <Teleport to="body">
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast show colored-toast mb-3"
          :class="toastBg(toast.type)"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
      >
        <div class="toast-header" :class="toastHeaderClass(toast.type)">
          <img class="bd-placeholder-img rounded me-2" src="/dashboard-assets/images/brand-logos/toggle-dark.png" alt="Logo" width="20" height="20">
          <strong class="me-auto">Ynex</strong>
          <button type="button" class="btn-close" @click="remove(toast.id)" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

function show({ message = 'پیام تست', type = 'success', duration = 3000 }) {
  const id = ++idCounter
  toasts.value.push({ id, message, type })

  setTimeout(() => remove(id), duration)
}

function remove(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function toastBg(type) {
  return {
    'bg-success-transparent': type === 'success',
    'bg-danger-transparent': type === 'error',
    'bg-warning-transparent': type === 'warning',
    'bg-info-transparent': type === 'info'
  }
}

function toastHeaderClass(type) {
  return {
    'bg-success text-fixed-white': type === 'success',
    'bg-danger text-fixed-white': type === 'error',
    'bg-warning text-dark': type === 'warning',
    'bg-info text-white': type === 'info'
  }
}

defineExpose({ show })
</script>

<style scoped>
.toast {
  opacity: 1;
}
</style>
