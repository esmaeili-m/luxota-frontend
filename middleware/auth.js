export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('auth middleware running')

  const { isAuthenticated, me } = useAuth()

  // اگر احراز هویت نشده، منتظر بمون که وضعیت کاربر از سرور گرفته شه
  if (!isAuthenticated.value) {
    await me()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
