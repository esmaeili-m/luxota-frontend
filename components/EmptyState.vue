<template>
  <div class="text-center py-5">
    <div class="empty-state-icon mb-3">
      <i :class="iconClass || 'ri-inbox-line'" class="fs-1 text-muted"></i>
    </div>
    <h5 class="text-muted mb-2">{{ title || 'No Data Found' }}</h5>
    <p class="text-muted mb-0">{{ message || 'There are no items to display at the moment.' }}</p>
  </div>
</template>

<script setup>
defineProps({
  iconClass: {
    type: String,
    default: 'ri-inbox-line'
  },
  title: {
    type: String,
    default: 'No Data Found'
  },
  message: {
    type: String,
    default: 'There are no items to display at the moment.'
  }
})
</script>

<style scoped>
.empty-state-icon {
  opacity: 0.5;
}
</style> 