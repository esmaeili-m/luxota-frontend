import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const token = computed(() => authStore.token)

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      authStore.setAuth(response.access_token, response.user)
      return response
    } catch (err) {
      error.value = err.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      authStore.clearAuth()
      loading.value = false
    }
  }

  const me = async () => {
    if (!token.value) return null
    
    try {
      const user = await $fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      authStore.setUser(user)
      return user
    } catch (err) {
      console.error('Get user error:', err)
      authStore.clearAuth()
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