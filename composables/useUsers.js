export const useUsers = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  // Get all users with pagination
  const getUsers = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        ...params
      })
      
      const { data: response } = await useFetch(`/users?${queryParams}`, {
        baseURL: config.public.apiBase
      })
      
      return response.value
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // Get all users without pagination
  const getAllUsers = async () => {
    try {
      const { data: response } = await useFetch('/users/all', {
        baseURL: config.public.apiBase
      })
      
      return response.value
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }

  // Get user by ID
  const getUserById = async (id) => {
    try {
      const { data: response } = await useFetch(`/users/${id}`, {
        baseURL: config.public.apiBase
      })
      
      return response.value
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  // Create new user
  const createUser = async (userData) => {
    try {
      const payload = new FormData()
      
      Object.keys(userData).forEach(key => {
        if (userData[key] !== '' && userData[key] !== null) {
          if (key === 'status') {
            payload.append(key, userData[key] ? '1' : '0')
          } else {
            payload.append(key, userData[key])
          }
        }
      })

      const response = await $fetch('/users', {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'Accept': 'application/json',
        }
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User created successfully.',
        type: 'success',
        duration: 3000
      })

      return response
    } catch (error) {
      console.error('Error creating user:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to create user.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Update user
  const updateUser = async (id, userData) => {
    try {
      const payload = new FormData()
      
      Object.keys(userData).forEach(key => {
        if (userData[key] !== '' && userData[key] !== null) {
          if (key === 'status') {
            payload.append(key, userData[key] ? '1' : '0')
          } else {
            payload.append(key, userData[key])
          }
        }
      })

      const response = await $fetch(`/users/${id}`, {
        method: 'POST',
        body: payload,
        baseURL: config.public.apiBase,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          'Accept': 'application/json',
        }
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User updated successfully.',
        type: 'success',
        duration: 3000
      })

      return response
    } catch (error) {
      console.error('Error updating user:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to update user.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Delete user (soft delete)
  const deleteUser = async (id) => {
    try {
      await $fetch(`/users/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: { Accept: 'application/json' },
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User moved to trash.',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to delete user.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Restore user
  const restoreUser = async (id) => {
    try {
      await $fetch(`/users/${id}/restore`, {
        baseURL: config.public.apiBase,
        method: 'POST',
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User restored successfully.',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('Error restoring user:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to restore user.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Force delete user
  const forceDeleteUser = async (id) => {
    try {
      await $fetch(`/users/force-delete/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: { Accept: 'application/json' },
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User permanently deleted.',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('Error force deleting user:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to delete user.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Toggle user status
  const toggleUserStatus = async (id) => {
    try {
      const response = await $fetch(`/users/${id}/toggle-status`, {
        baseURL: config.public.apiBase,
        method: 'POST',
      })

      nuxtApp.$toast({
        title: 'Success!',
        message: 'User status updated successfully.',
        type: 'success',
        duration: 3000
      })

      return response
    } catch (error) {
      console.error('Error toggling user status:', error)
      nuxtApp.$toast({
        title: 'Error!',
        message: 'Failed to update user status.',
        type: 'error',
        duration: 3000
      })
      throw error
    }
  }

  // Search users
  const searchUsers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters)
      
      const { data: response } = await useFetch(`/users/search?${queryParams}`, {
        baseURL: config.public.apiBase
      })
      
      return response.value
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  // Get trashed users
  const getTrashedUsers = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        ...params
      })
      
      const { data: response } = await useFetch(`/users/trash?${queryParams}`, {
        baseURL: config.public.apiBase
      })
      
      return response.value
    } catch (error) {
      console.error('Error fetching trashed users:', error)
      throw error
    }
  }

  return {
    getUsers,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    toggleUserStatus,
    searchUsers,
    getTrashedUsers
  }
} 