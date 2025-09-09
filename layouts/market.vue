<template>
  <body class="   text-white" style="background-color: #011530 !important;">
    <HeaderMarket />
    <NuxtPage />
    <a
        href="javascript:void(0)"
        class="fixed left-auto items-center justify-center hidden w-10 h-10 text-white transition duration-300 ease-in-out rounded-md shadow-md back-to-top bottom-8 right-8 z-999 bg-primary hover:bg-dark"
    >
      <span
          class="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"
      ></span>
    </a>
    <a
        target="_blank"
        rel="nofollow noopener"
        class="fixed bottom-8 left-4 z-999 inline-flex items-center gap-[10px] rounded-lg bg-white px-[14px] py-2 shadow-2 dark:bg-dark-2 sm:left-9"
        href="https://tailgrids.com/"
    >
      <span class="text-base font-medium text-dark-3 dark:text-dark-6">
        Made with
      </span>
      <span class="block w-px h-4 bg-stroke dark:bg-dark-3"></span>
      <span class="block w-full max-w-[88px]">
        <img
            src="/market-assets/images/brands/tailgrids.svg"
            alt="tailgrids"
            class="dark:hidden"
        />
        <img
            src="/market-assets/images/brands/tailgrids-white.svg"
            alt="tailgrids"
            class="hidden dark:block"
        />
      </span>
    </a>
  </body>
</template>

<script setup>
import HeaderMarket from "~/components/market/HeaderMarket.vue";
import { onMounted } from "vue";
useHead({
  title: 'Luxota Market',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'description', content: 'Bootstrap Responsive Admin Web Dashboard HTML5 Template' },
    { name: 'author', content: 'Spruko Technologies Private Limited' },
    { name: 'keywords', content: 'admin, admin dashboard, admin panel, admin template, bootstrap, clean, dashboard' }
  ],
  link: [],
  script: []
})
</script>