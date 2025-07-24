<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 text-center">
        <h1 class="display-4 mb-4">Welcome to Luxota</h1>
        <p class="lead mb-4">Your Laravel + Nuxt 3 Application</p>
        <div class="d-grid gap-2 d-md-block">
          <NuxtLink to="/login" class="btn btn-primary btn-lg me-md-2">
            Sign In
          </NuxtLink>
          <NuxtLink to="/register" class="btn btn-outline-secondary btn-lg">
            Sign Up
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page title
useHead({
  title: 'Welcome - Luxota'
})
</script>