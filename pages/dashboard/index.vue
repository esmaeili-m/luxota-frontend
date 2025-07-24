<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Dashboard</h4>
          </div>
          <div class="card-body">
            <div v-if="authStore.user" class="row">
              <div class="col-md-6">
                <h5>Welcome, {{ authStore.user.name }}!</h5>
                <p class="text-muted">Email: {{ authStore.user.email }}</p>
                <p class="text-muted">Member since: {{ new Date(authStore.user.created_at).toLocaleDateString() }}</p>
              </div>
              <div class="col-md-6 text-end">
                <button @click="handleLogout" class="btn btn-danger">
                  <i class="ri-logout-box-r-line me-2"></i>
                  Logout
                </button>
              </div>
            </div>
            <div v-else class="text-center">
              <p>Loading user information...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { logout } = useAuth()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  authStore.logout()
  await router.push('/login')
}

// Set page title
useHead({
  title: 'Dashboard - Luxota'
})
</script>