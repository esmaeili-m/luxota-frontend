import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth' // فرض بر Pinia

export const useAuth = () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // گرفتن کوکی CSRF از لاراول
  const getCsrfCookie = async () => {
    await $fetch(`${config.public.csrfEndpoint}`, {
      credentials: 'include'
    })
  }

  // لاگین کاربر
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()
      const xsrfToken = useCookie('XSRF-TOKEN').value
      if (!xsrfToken) throw new Error('XSRF token not found')

      const response = await $fetch('/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: credentials,
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
          Accept: 'application/json'
        }
      })
      console.log(response)

      // فقط کاربر رو ست می‌کنیم، توکن نداریم
      authStore.setUser(response.user)

      return response
    } catch (err) {
      error.value = err.data?.message || err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // لاگ‌اوت کاربر
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()
      const xsrfToken = useCookie('XSRF-TOKEN').value
      if (!xsrfToken) throw new Error('XSRF token not found')

      await $fetch('/auth/logout', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
          Accept: 'application/json'
        }
      })

      authStore.clearAuth()
    } catch (err) {
      error.value = err.data?.message || err.message || 'Logout failed'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // گرفتن اطلاعات کاربر (مثلاً صفحه پروفایل)
  const me = async () => {
    try {
      const user = await $fetch('/auth/me', {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      })

      authStore.setUser(user)

      return user
    } catch (err) {
      authStore.clearAuth()
      return null
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    me
  }
}
