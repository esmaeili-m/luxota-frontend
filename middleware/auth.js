export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, me } = useAuth()
  // ابتدا سعی می‌کنیم اطلاعات کاربر رو لود کنیم
  await me()

  // صبر کوتاه (در صورت تأخیر در ری‌اکتیو شدن)
  await nextTick()
  console.log(isAuthenticated)

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
