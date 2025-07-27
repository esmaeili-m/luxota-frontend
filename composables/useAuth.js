import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth' // فرض بر اینه از Pinia یا مشابه داری

export const useAuth = () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const token = computed(() => authStore.token)

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
    const xsrfToken = useCookie('XSRF-TOKEN').value
    try {

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

      // اطلاعات توکن و کاربر را ذخیره کن
      authStore.setAuth(response.access_token, response.user)
      return response

    } catch (err) {
      error.value = err.data?.message || 'Login failed'
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
      // ابتدا کوکی CSRF را بگیر
      await getCsrfCookie()

      // درخواست لاگ‌اوت را بفرست
      await $fetch('/auth/logout', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      })

      // پاک‌کردن داده‌های کاربر و توکن
      authStore.clearAuth()

    } catch (err) {
      error.value = err.data?.message || 'Logout failed'
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
      console.log('a')

      return user
    } catch (err) {
      authStore.clearAuth()
      console.log('b')

      return null
    }
  }

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    login,
    logout,
    me
  }
}
