export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, me } = useAuth()

  if (!isAuthenticated.value) {
    await me()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
