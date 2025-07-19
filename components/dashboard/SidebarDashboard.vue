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
          <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path> </svg>
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
          <li class="slide">
            <NuxtLink to="/dashboard/users" class="side-menu__item">
              <i class="bx bx-user side-menu__icon"></i>
              <span class="side-menu__label">Users</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/roles" class="side-menu__item">
              <i class="bx bx-user-check side-menu__icon"></i>
              <span class="side-menu__label">Roles</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/zones" class="side-menu__item">
              <i class="bx bx-map side-menu__icon"></i>
              <span class="side-menu__label">Zones</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/ranks" class="side-menu__item">
              <i class="bx bx-trophy side-menu__icon"></i>
              <span class="side-menu__label">Ranks</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/branches" class="side-menu__item">
              <i class="bx bx-git-branch side-menu__icon"></i>
              <span class="side-menu__label">Branches</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/countries" class="side-menu__item">
              <i class="bx bx-globe side-menu__icon"></i>
              <span class="side-menu__label">Countries</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/cities" class="side-menu__item">
              <i class="bx bx-building-house side-menu__icon"></i>
              <span class="side-menu__label">Cities</span>
            </NuxtLink>
          </li>
          <li class="slide">
            <NuxtLink to="/dashboard/referrers" class="side-menu__item">
              <i class="bx bx-share-alt side-menu__icon"></i>
              <span class="side-menu__label">Referrers</span>
            </NuxtLink>
          </li>
          <li class="slide has-sub" :class="{ 'open': isDropdownOpen }">
            <a href="#" class="side-menu__item" @click.prevent="toggleDropdown">
              <i class="bx bx-home side-menu__icon"></i>
              <span class="side-menu__label">
        Dashboards
        <span class="badge bg-warning-transparent ms-2">{{ roles?.length }}</span>
      </span>
              <i class="fe fe-chevron-right side-menu__angle"></i>
            </a>

            <ul class="slide-menu child1" :style="{ display: isDropdownOpen ? 'block' : 'none' }">
              <li class="slide side-menu__label1">
                <a href="javascript:void(0)">Dashboards</a>
              </li>

              <li
                  v-for="role in roles"
                  :key="role.title"
                  class="slide"
              >
                <NuxtLink :to="`/dashboard/users/${role.title}`" class="side-menu__item">
                  {{ role.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <!-- Start::slide -->


          <!-- End::slide -->
        </ul>
        <div class="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path> </svg></div>
      </nav>
      <!-- End::nav -->

    </div>
    <!-- End::main-sidebar -->

  </aside>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  const roles = ref([])
  const isDropdownOpen = ref(false)
  const config = useRuntimeConfig()

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  async function get_roles() {
    try {
      const data = await $fetch('/roles/all', {
        baseURL: config.public.apiBase,
      })
      roles.value = data.data
    } catch (error) {
      console.error('Failed to fetch roles:', error)
      // Optional fallback if fetch fails
      roles.value = [
        { name: 'admin', label: 'Admin Dashboard' },
        { name: 'manager', label: 'Manager Dashboard' },
        { name: 'user', label: 'User Dashboard' }
      ]
    }
  }

  onMounted(() => {
    get_roles()
    roles.value = [
      { name: 'admin', label: 'Admin Dashboard' },
      { name: 'manager', label: 'Manager Dashboard' },
      { name: 'user', label: 'User Dashboard' }
    ]

    setTimeout(() => {
      if (typeof slideToggle === 'function') {
        const firstLevelItems = document.querySelectorAll(".nav > ul > .slide.has-sub > a")
        firstLevelItems.forEach((element) => {
          element.addEventListener("click", (e) => {
            e.preventDefault()
            console.log('Dropdown clicked!')
            const submenu = element.nextElementSibling
            if (submenu) {
              slideToggle(submenu)
            }
          })
        })
      } else {
        console.log('slideToggle function not found')
        
        const firstLevelItems = document.querySelectorAll(".nav > ul > .slide.has-sub > a")
        console.log('Using fallback, found first level items:', firstLevelItems.length)
        
        firstLevelItems.forEach((element) => {
          element.addEventListener("click", (e) => {
            e.preventDefault()
            console.log('Dropdown clicked (fallback)!')
            const parent = element.closest('.slide.has-sub')
            const submenu = parent.querySelector('.slide-menu')
            
            if (submenu) {
              if (submenu.style.display === 'block' || window.getComputedStyle(submenu).display === 'block') {
                submenu.style.display = 'none'
                parent.classList.remove('open')
              } else {
                submenu.style.display = 'block'
                parent.classList.add('open')
              }
            }
          })
        })
      }
    }, 500)
  })
</script>

<style scoped>
.slide-menu {
  transition: all 0.3s ease;
}

.slide.has-sub.open > .side-menu__item .side-menu__angle {
  transform: rotate(90deg);
}

.side-menu__angle {
  transition: transform 0.3s ease;
}
</style>
