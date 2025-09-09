<template>
  <header class="fixed top-0 left-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center bg-transparent">

      <!-- Logo -->
      <div class="flex items-center">
        <nuxt-link to="/dashboard">
          <img src="/market-assets/images/logo/Luxota-Market.png" alt="Logo" class="h-10 w-auto" />
        </nuxt-link>
      </div>

      <!-- Menu -->
      <nav>
        <ul class="flex space-x-6 items-center">

          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Home</a></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Release Notes</a></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Services</a></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Contact</a></li>

          <!-- Buttons -->
          <div class="inline-flex shadow-sm ml-4" role="group">
            <!-- Sign In -->
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-l-lg hover:bg-white hover:text-black transition"
            >
              Sign In
            </button>

            <!-- Settings -->
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-r-lg hover:bg-white hover:text-black transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="lucide lucide-settings">
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319
                       1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0
                       0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0
                       0 0-3.319 1.915 2.34 2.34 0 0 1-4.659
                       0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34
                       0 0 1-2.33-4.033 2.34 2.34 0 0 0
                       0-3.831A2.34 2.34 0 0 1 6.35
                       6.051a2.34 2.34 0 0 0 3.319-1.915"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>

        </ul>
      </nav>

    </div>
  </header>
</template>

<script setup>
// اسکریپت اضافی فقط در صورت نیاز به منو داینامیک
</script>

<style scoped>
/* استایل اضافه در صورت نیاز */
</style>
