<template>
  <div>
    <SettingsDashboard />
    <div class="page">
      <HeaderDashboard />
      <SidebarDashboard />
      <div class="main-content app-content">
        <div class="container-fluid">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarDashboard from '~/components/dashboard/SidebarDashboard.vue'
import HeaderDashboard from '~/components/dashboard/HeaderDashboard.vue'
import SettingsDashboard from '~/components/dashboard/SettingsDashboard.vue'
useHead({
  title: 'Luxota Dashboard Panel',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'description', content: 'Bootstrap Responsive Admin Web Dashboard HTML5 Template' },
    { name: 'author', content: 'Spruko Technologies Private Limited' },
    { name: 'keywords', content: 'admin, admin dashboard, admin panel, admin template, bootstrap, clean, dashboard' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/dashboard-assets/images/brand-logos/favicon.ico' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/bootstrap/css/bootstrap.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/css/styles.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/css/icons.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/css/custom.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/node-waves/waves.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/simplebar/simplebar.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/flatpickr/flatpickr.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/@simonwep/pickr/themes/nano.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/choices.js/public/assets/styles/choices.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/jsvectormap/css/jsvectormap.min.css' },
    { rel: 'stylesheet', href: '/dashboard-assets/libs/swiper/swiper-bundle.min.css' },
  ],
  script: [
    { src: '/dashboard-assets/libs/choices.js/public/assets/scripts/choices.min.js' },
    { src: '/dashboard-assets/js/main.js' },
    { src: '/dashboard-assets/libs/@popperjs/core/umd/popper.min.js', defer: true },
    { src: '/dashboard-assets/libs/bootstrap/js/bootstrap.bundle.min.js', defer: true },
    { src: '/dashboard-assets/js/defaultmenu.min.js', defer: true },
    { src: '/dashboard-assets/libs/node-waves/waves.min.js', defer: true },
    { src: '/dashboard-assets/js/sticky.js', defer: true },
    { src: '/dashboard-assets/libs/filepond/filepond.min.js', defer: true },
    { src: '/dashboard-assets/libs/filepond-plugin-image-preview/filepond-plugin-image-preview.min.js', defer: true },
    { src: '/dashboard-assets/libs/simplebar/simplebar.min.js', defer: true },
    { src: '/dashboard-assets/js/simplebar.js', defer: true },
    { src: '/dashboard-assets/libs/@simonwep/pickr/pickr.es5.min.js', defer: true },
    { src: '/dashboard-assets/libs/jsvectormap/js/jsvectormap.min.js', defer: true },
    { src: '/dashboard-assets/libs/jsvectormap/maps/world-merc.js', defer: true },
    { src: '/dashboard-assets/libs/apexcharts/apexcharts.min.js', defer: true },
    { src: '/dashboard-assets/libs/chart.js/chart.min.js', defer: true },
    // { src: '/dashboard-assets/js/crm-dashboard.js', defer: true },
    { src: '/dashboard-assets/js/custom-switcher.min.js', defer: true },
    { src: '/dashboard-assets/js/modal.js', defer: true },
    { src: '/dashboard-assets/js/custom.js', defer: true },
    { src: '/dashboard-assets/js/Toasts.js', defer: true },
]
})
</script>
