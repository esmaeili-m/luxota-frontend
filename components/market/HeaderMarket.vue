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

          <li><nuxt-link to="/" href="/" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Home</nuxt-link></li>
          <li><nuxt-link to="/market/invoices/list" href="/" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Invoices</nuxt-link></li>
          <li><nuxt-link to="/market/invoices/vouchers" href="/" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Vouchers</nuxt-link></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Release Notes</a></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Services</a></li>
          <li><a href="#" class="inline-block hover:font-bold text-white/80 text-[19px] hover:text-white  transform hover:scale-125 transition-all duration-300  ">Contact</a></li>
          <li>
            <nuxt-link href="/market/invoices/" class="relative inline-block hover:font-bold text-white/80 text-[19px] hover:text-white transform hover:scale-125 transition-all duration-300">
              <!-- آیکون سبد خرید -->
              <svg fill="currentColor" width="35px" height="35px" viewBox="0 0 32 32"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M31.739 8.875c-0.186-0.264-0.489-0.422-0.812-0.422h-21.223l-1.607-5.54c-0.63-2.182-2.127-2.417-2.741-2.417h-4.284c-0.549 0-0.993 0.445-0.993 0.993s0.445 0.993 0.993 0.993h4.283c0.136 0 0.549 0 0.831 0.974l5.527 20.311c0.12 0.428 0.511 0.724 0.956 0.724h13.499c0.419 0 0.793-0.262 0.934-0.657l4.758-14.053c0.11-0.304 0.064-0.643-0.122-0.907zM25.47 22.506h-12.046l-3.161-12.066h19.253zM23.5 26.504c-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5zM14.5 26.504c-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5z">
                </path>
              </svg>

              <!-- بج تعداد آیتم -->
              <span
                  class="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {{ cart.itemCount ?? 0}}
              </span>
            </nuxt-link>
          </li>


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
const auth = useAuthStore()
const config = useRuntimeConfig()
import { useCartStore } from '~/stores/cart'
const cart = useCartStore()
await cart.fetchHeaderCount()

</script>

<style scoped>
/* استایل اضافه در صورت نیاز */
</style>
