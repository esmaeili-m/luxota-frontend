<template>
  <aside class="app-sidebar sticky" id="sidebar">

    <!-- Start::main-sidebar-header -->
    <div class="main-sidebar-header">
      <a href="index.html" class="header-logo">
        <img src="/dashboard-assets/images/brand-logos/desktop-logo.png" alt="logo" class="desktop-logo">
        <img src="/dashboard-assets/images/brand-logos/toggle-logo.png" alt="logo" class="toggle-logo">
        <img src="/dashboard-assets/images/brand-logos/desktop-dark.png" alt="logo" class="desktop-dark">
        <img src="/dashboard-assets/images/brand-logos/toggle-dark.png" alt="logo" class="toggle-dark">
      </a>
    </div>
    <!-- End::main-sidebar-header -->

    <!-- Start::main-sidebar -->
    <div class="main-sidebar" id="sidebar-scroll">

      <!-- Start::nav -->
      <nav class="nav nav-pills flex-column sub-open">
        <div class="slide-left" id="slide-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
          </svg>
        </div>
        <ul class="main-menu">
          <!-- Start::slide__category -->
          <li class="slide__category"><span class="category-name">Main</span></li>
          <!-- End::slide__category -->
          <li class="slide">
            <NuxtLink to="/dashboard/categories" class="side-menu__item">
              <i class="bx bx-category side-menu__icon"></i>
              <span class="side-menu__label">Categories</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/products" class="side-menu__item">
              <i class="bx bx-store side-menu__icon"></i>
              <span class="side-menu__label">Products</span>
            </NuxtLink>
          </li>
          <li class="slide__category"><span class="category-name">Users</span></li>
          <li v-if="auth?.user?.permissions.includes('user.index')"  class="slide has-sub" :class="{ 'open': isDropdownOpen }">
            <a href="#" class="side-menu__item" @click.prevent="toggleDropdown">
              <i class="bx bx-home side-menu__icon"></i>
              <span class="side-menu__label">
        Users
        <span class="badge bg-warning-transparent ms-2" v-if="!isLoadingRoles">{{ roles?.length }}</span>
        <span class="badge bg-warning-transparent ms-2" v-else>
          <div class="spinner-border text-warning spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
        </span>
      </span>
              <i class="fe fe-chevron-right side-menu__angle" :class="{ 'rotated': isDropdownOpen }"></i>
            </a>

            <ul class="slide-menu child1" :style="{ display: isDropdownOpen ? 'block' : 'none' }"
                :class="{ 'menu-open': isDropdownOpen }">
              <li class="slide side-menu__label1">
                <a href="javascript:void(0)">Users</a>
              </li>

              <li
                  v-for="role in roles"
                  :key="role.name"
                  class="slide"
                  :class="{ 'active': isActive(`/dashboard/users/${role.name}`) }"
              >
                <NuxtLink :to="`/dashboard/users/${role.name}`" class="side-menu__item">
                  {{ role.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li v-if="auth?.user?.permissions.includes('role.index')" class="slide " :class="{ 'active': isActive('/dashboard/roles') }">
            <NuxtLink to="/dashboard/roles" class="side-menu__item">
              <i class="bx bx-user-check side-menu__icon"></i>
              <span class="side-menu__label">Roles</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/zones') }">
            <NuxtLink to="/dashboard/zones" class="side-menu__item">
              <i class="bx bx-map side-menu__icon"></i>
              <span class="side-menu__label">Zones</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/ranks') }">
            <NuxtLink to="/dashboard/ranks" class="side-menu__item">
              <i class="bx bx-trophy side-menu__icon"></i>
              <span class="side-menu__label">Ranks</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/branches') }">
            <NuxtLink to="/dashboard/branches" class="side-menu__item">
              <i class="bx bx-git-branch side-menu__icon"></i>
              <span class="side-menu__label">Branches</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/countries') }">
            <NuxtLink to="/dashboard/countries" class="side-menu__item">
              <i class="bx bx-globe side-menu__icon"></i>
              <span class="side-menu__label">Countries</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/cities') }">
            <NuxtLink to="/dashboard/cities" class="side-menu__item">
              <i class="bx bx-building-house side-menu__icon"></i>
              <span class="side-menu__label">Cities</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/referrers') }">
            <NuxtLink to="/dashboard/referrers" class="side-menu__item">
              <i class="bx bx-share-alt side-menu__icon"></i>
              <span class="side-menu__label">Referrers</span>
            </NuxtLink>
          </li>
          <li class="slide" :class="{ 'active': isActive('/dashboard/activityLog') }">
            <NuxtLink to="/dashboard/activityLog" class="side-menu__item">
              <i class="bx bx-history side-menu__icon"></i>
              <span class="side-menu__label">Activity Log</span>
            </NuxtLink>
          </li>

          <!-- Start::slide -->


          <!-- End::slide -->
        </ul>
        <div class="slide-right" id="slide-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
          </svg>
        </div>
      </nav>
      <!-- End::nav -->

    </div>
    <!-- End::main-sidebar -->

  </aside>
</template>

<script setup>
import {useRoute} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
import {ref, computed, onMounted, watch} from 'vue'
const xsrfToken = useCookie('XSRF-TOKEN')

const roles = ref([])
const isDropdownOpen = ref(false)
const config = useRuntimeConfig()
const isLoadingRoles = ref(true);

const route = useRoute()
onMounted(() => {
  get_roles()
})

async function get_roles() {
  isLoadingRoles.value = true;
  try {
    const data = await $fetch('/roles/all', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers :{
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken.value || ''),
        Accept: 'application/json',

      }
    })
    roles.value = data.data
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    roles.value = [
      {name: 'name', label: 'Admin '},
    ]
  }
  isLoadingRoles.value = false;

}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
watch(() => route.path, (newPath) => {
  isDropdownOpen.value = newPath.startsWith('/dashboard/users')
})

const isActive = (path) => {
  return route.path.startsWith(path)
}
</script>


<style scoped>
.slide-menu {
  transition: all 0.3s ease;
}

.slide.active {
  background-color: #f5f5f5;
  border-right: 3px solid #fd15e0;
}

.side-menu__item {
  transition: background-color 0.3s;
}


.slide-menu.menu-open {
  animation: slideDown 0.3s ease;
}

.slide-menu li {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-menu.menu-open li {
  opacity: 1;
  transform: translateY(0);
}

.slide-menu.menu-open li:nth-child(1) {
  animation-delay: 0.1s;
}

.slide-menu.menu-open li:nth-child(2) {
  animation-delay: 0.2s;
}

.slide-menu.menu-open li:nth-child(3) {
  animation-delay: 0.3s;
}

.slide-menu.menu-open li:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.side-menu__angle {
  transition: transform 0.3s ease;
}

.side-menu__angle.rotated {
  transform: rotate(90deg);
}

.slide.has-sub.open > .side-menu__item .side-menu__angle {
  transform: rotate(90deg);
}
</style>
