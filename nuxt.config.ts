// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  plugins: [
  ],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api/v1',
      fileBase: 'http://localhost:8000/storage',
      csrfEndpoint: 'http://localhost:8000/sanctum/csrf-cookie'

    }
  },
  css: [
    '~/public/dashboard-assets/libs/bootstrap/css/bootstrap.min.css',
    '~/public/dashboard-assets/css/styles.min.css',
    '~/public/dashboard-assets/css/icons.min.css'
  ]
})
