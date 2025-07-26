export const useUsers = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const users = ref([])
  const user = ref(null)
  const loading = ref(false)
  const errorUser = ref(null)
  const page = ref(1)
  const perPage = ref(15)

  const getUsers = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        ...params
      })

      const response = await $fetch(`/users?${queryParams}`, {
        baseURL: config.public.apiBase
      })
      users.value = response
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (id) => {
    loading.value = true
    try {
      const response = await $fetch(`/users/${id}`, {
        baseURL: config.public.apiBase,
      })
      user.value = response
      return response
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload, errors=null) => {
    const { data, error } = await useFetch('/users', {
      method: 'POST',
      body: payload,
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
      },
    })
    Object.keys(errors).forEach(key => delete errors[key])

    if (error.value) {
      const allErrors = error.value?.data?.errors
      if (allErrors && typeof allErrors === 'object') {
        for (const field in allErrors) {
          if (Array.isArray(allErrors[field])) {
            errors[field] = allErrors[field][0]
          }
        }

      } else {
        errors.general = error.value?.data?.message || 'خطایی رخ داده است'
      }
      return  false
    } else {
      nuxtApp.$toast({
        title: 'Success!',
        message: 'User created successfully.',
        type: 'success',
        duration: 3000,
      })
      return  true
    }
  }

  const updateUser = async (id, payload, errors = null) => {
    const { data, error } = await useFetch(`/users/${id}`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'X-HTTP-Method-Override': 'PUT',
        Accept: 'application/json',
      },
      body: payload,
    })

    if (errors && typeof errors === 'object') {
      Object.keys(errors).forEach(key => delete errors[key])
    }
    if (error.value) {
      const allErrors = error.value?.data?.errors
      if (allErrors && typeof allErrors === 'object') {
        for (const field in allErrors) {
          if (Array.isArray(allErrors[field])) {
            errors[field] = allErrors[field][0]
          }
        }
      } else {
        errors.general = error.value?.data?.message || 'خطایی رخ داده است'
      }
      return false
    } else {
      nuxtApp.$toast({
        title: 'Success!',
        message: 'User updated successfully.',
        type: 'success',
        duration: 3000,
      })
      return true
    }
  }

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

  const searchUsers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters)
      const response = await $fetch(`/users/search?${queryParams}`, {
        baseURL: config.public.apiBase
      })
      users.value = response
      console.log(users.value)
      return response

    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

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

  const getUserRole = async (roleId, filters = {}) => {
    loading.value = true
    try {
      const queryParams = new URLSearchParams({
        page: page.value,
        ...filters
      })
      const xsrfToken = useCookie('XSRF-TOKEN').value

      const response = await $fetch(`/users/user-role/${roleId}`, {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
          Accept: 'application/json'
        }
      })
      users.value = response
      return response
    } catch (error) {
      console.error('Error fetching users by role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setPage = (newPage) => {
    page.value = newPage
  }
  return {
    users,
    user,
    loading,
    errorUser,
    page,
    perPage,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    toggleUserStatus,
    searchUsers,
    getTrashedUsers,
    getUserRole,
    setPage,
  }
}

