export const useRoles = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const roles = ref([])
  const loading = ref(false)
  const errorRole = ref(null)

  const getRoles = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        ...params
      })

      const data = await $fetch(`roles/all?${queryParams}`, {
        baseURL: config.public.apiBase
      })

      roles.value = data
      return data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // 🔍 گرفتن کاربر خاص
  const getUserById = async (id) => {
    try {
      return await $fetch(`/users/${id}`, {
        baseURL: config.public.apiBase
      })
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      throw error
    }
  }

  // ➕ ساخت کاربر
  const createUser = async (userData) => {
    try {
      const payload = new FormData()
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          payload.append(key, key === 'status' ? (value ? '1' : '0') : value)
        }
      })

      const response = await $fetch('/users', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: payload,
        headers: { Accept: 'application/json' }
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User created successfully.',
        type: 'success'
      })

      reloadUsers()
      return response
    } catch (error) {
      console.error('Error creating user:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to create user.',
        type: 'error'
      })
      throw error
    }
  }

  // ✏️ ویرایش کاربر
  const updateUser = async (id, userData) => {
    try {
      const payload = new FormData()
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          payload.append(key, key === 'status' ? (value ? '1' : '0') : value)
        }
      })

      const response = await $fetch(`/users/${id}`, {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          Accept: 'application/json'
        },
        body: payload
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User updated successfully.',
        type: 'success'
      })

      reloadUsers()
      return response
    } catch (error) {
      console.error('Error updating user:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to update user.',
        type: 'error'
      })
      throw error
    }
  }

  // 🗑 حذف نرم کاربر
  const deleteUser = async (id) => {
    try {
      await $fetch(`/users/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: { Accept: 'application/json' }
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User deleted.',
        type: 'success'
      })

      reloadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to delete user.',
        type: 'error'
      })
      throw error
    }
  }

  // ♻️ بازگرداندن کاربر
  const restoreUser = async (id) => {
    try {
      await $fetch(`/users/${id}/restore`, {
        method: 'POST',
        baseURL: config.public.apiBase,
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User restored.',
        type: 'success'
      })

      reloadUsers()
    } catch (error) {
      console.error('Error restoring user:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to restore user.',
        type: 'error'
      })
      throw error
    }
  }

  // ❌ حذف دائم
  const forceDeleteUser = async (id) => {
    try {
      await $fetch(`/users/force-delete/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: { Accept: 'application/json' }
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User permanently deleted.',
        type: 'success'
      })

      reloadUsers()
    } catch (error) {
      console.error('Error force deleting user:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to permanently delete user.',
        type: 'error'
      })
      throw error
    }
  }

  // 🔁 تغییر وضعیت فعال/غیرفعال کاربر
  const toggleUserStatus = async (id) => {
    try {
      const response = await $fetch(`/users/${id}/toggle-status`, {
        method: 'POST',
        baseURL: config.public.apiBase,
      })

      nuxtApp.$toast?.({
        title: 'Success!',
        message: 'User status updated.',
        type: 'success'
      })

      reloadUsers()
      return response
    } catch (error) {
      console.error('Error toggling user status:', error)
      nuxtApp.$toast?.({
        title: 'Error!',
        message: 'Failed to update user status.',
        type: 'error'
      })
      throw error
    }
  }

  // 🔍 جستجوی کاربر
  const searchUsers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters)

      return await $fetch(`/users/search?${queryParams}`, {
        baseURL: config.public.apiBase
      })
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  // 🗃 لیست کاربران حذف‌شده
  const getTrashedUsers = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        ...params
      })

      return await $fetch(`/users/trash?${queryParams}`, {
        baseURL: config.public.apiBase
      })
    } catch (error) {
      console.error('Error fetching trashed users:', error)
      throw error
    }
  }

  // 📦 خروجی نهایی
  return {
    roles,
    errorRole,
    getRoles,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    toggleUserStatus,
    searchUsers,
    getTrashedUsers,
  }
}
