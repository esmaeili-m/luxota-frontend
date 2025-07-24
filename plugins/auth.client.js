export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initAuth()
  
  // Add auth token to all requests
  addRouteMiddleware('auth-token', (to, from) => {
    const token = authStore.getToken
    if (token) {
      // Set default headers for all requests
      $fetch.create({
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
  }, { global: true })
}) 