export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  console.log(isAuthenticated.value)
  // If user is not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
}) 