export default defineNuxtRouteMiddleware((to, from) => {
  console.log('auth middleware running')

  const { isAuthenticated } = useAuth()
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
}) 