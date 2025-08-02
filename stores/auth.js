import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    roles: [],
    permissions: []
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getIsAuthenticated: (state) => state.isAuthenticated,
    hasPermission: (state) => (permission) => state.permissions.includes(permission),
    hasRole: (state) => (role) => state.roles.includes(role)
  },

  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    setUser(user) {
      this.user = user
      this.isAuthenticated = true
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.roles = []
      this.permissions = []

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_roles')
        localStorage.removeItem('auth_permissions')
      }
    },

    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('auth_user')
        const roles = localStorage.getItem('auth_roles')
        const permissions = localStorage.getItem('auth_permissions')

        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.roles = roles ? JSON.parse(roles) : []
          this.permissions = permissions ? JSON.parse(permissions) : []
          this.isAuthenticated = true
        }
      }
    },

    async fetchUserFromApi() {
      try {
        const res = await $fetch('/api/me', {
          credentials: 'include'
        })

        this.user = res.user
        this.roles = res.roles
        this.permissions = res.permissions
        this.isAuthenticated = true

        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(res.user))
          localStorage.setItem('auth_roles', JSON.stringify(res.roles))
          localStorage.setItem('auth_permissions', JSON.stringify(res.permissions))
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات کاربر:', error)
        this.clearAuth()
      }
    }
  }
})
