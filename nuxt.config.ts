// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
        tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api/v1',
      fileBase: 'http://localhost:8000/storage',
      csrfEndpoint: 'http://localhost:8000/sanctum/csrf-cookie'
    }
  },
})
