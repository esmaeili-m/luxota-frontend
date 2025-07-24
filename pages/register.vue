<template>
  <div class="container">
    <div class="row justify-content-center align-items-center authentication authentication-basic h-100">
      <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
        <div class="my-5 d-flex justify-content-center">
          <NuxtLink to="/">
            <img src="/dashboard-assets/images/brand-logos/desktop-logo.png" alt="logo" class="desktop-logo">
            <img src="/dashboard-assets/images/brand-logos/desktop-dark.png" alt="logo" class="desktop-dark">
          </NuxtLink>
        </div>
        <div class="card custom-card">
          <div class="card-body p-5">
            <p class="h5 fw-semibold mb-2 text-center">Sign Up</p>
            <p class="mb-4 text-muted op-7 fw-normal text-center">Create your account</p>
            
            <div class="alert alert-info" role="alert">
              <i class="ri-information-line me-2"></i>
              Registration functionality is not implemented yet. Please contact the administrator.
            </div>
            
            <div class="text-center">
              <p class="fs-12 text-muted mt-3">
                Already have an account? 
                <NuxtLink to="/login" class="text-primary">Sign In</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Set page title
useHead({
  title: 'Sign Up - Luxota'
})
</script> 