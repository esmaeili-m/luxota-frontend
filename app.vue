<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
    <GlobalToast ref="globalToast" />
  </div>
</template>
<script setup>
import GlobalToast from '~/components/GlobalToast.vue'
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const globalToast = ref(null)

onMounted(() => {
  const nuxtApp = useNuxtApp()

  // provide با نام دلخواه
  if (!nuxtApp.$toast) {
    nuxtApp.provide('toast', (options) => {
      globalToast.value?.show(options)
    })
  }
})
</script>

