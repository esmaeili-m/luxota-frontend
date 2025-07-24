<template>
  <div class="container">
    <div class="row justify-content-center align-items-center authentication authentication-basic h-100">
      <div class="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
        <div class="my-5 d-flex justify-content-center">
          <a href="/">
            <img src="../assets/images/brand-logos/desktop-logo.png" alt="logo" class="desktop-logo">
            <img src="../assets/images/brand-logos/desktop-dark.png" alt="logo" class="desktop-dark">
          </a>
        </div>
        <div class="card custom-card">
          <div class="card-body p-5">
            <p class="h5 fw-semibold mb-2 text-center">Sign In</p>
            <p class="mb-4 text-muted op-7 fw-normal text-center">Welcome back!</p>
            
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleLogin">
              <div class="row gy-3">
                <div class="col-xl-12">
                  <label for="signin-email" class="form-label text-default">Email</label>
                  <input 
                    type="email" 
                    :class="['form-control form-control-lg', errors.email ? 'is-invalid' : '']" 
                    id="signin-email" 
                    v-model="form.email"
                    placeholder="example@email.com"
                  >
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
                <div class="col-xl-12 mb-2">
                  <label for="signin-password" class="form-label text-default d-block">
                    Password
                    <NuxtLink to="/forgot-password" class="float-end text-danger">Forgot password?</NuxtLink>
                  </label>
                  <div class="input-group">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      :class="['form-control form-control-lg', errors.password ? 'is-invalid' : '']" 
                      id="signin-password" 
                      v-model="form.password"
                      placeholder="Password"
                    >
                    <button 
                      class="btn btn-light" 
                      type="button" 
                      @click="togglePassword"
                    >
                      <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'" class="align-middle"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                  <div class="mt-2">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="form.remember"
                        id="rememberMe"
                      >
                                              <label class="form-check-label text-muted fw-normal" for="rememberMe">
                          Remember me
                        </label>
                    </div>
                  </div>
                </div>
                <div class="col-xl-12 d-grid mt-2">
                  <button 
                    type="submit" 
                    class="btn btn-lg btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                  </button>
                </div>
              </div>
            </form>
            
            <div class="text-center">
              <p class="fs-12 text-muted mt-3">
                Don't have an account? 
                <NuxtLink to="/register" class="text-primary">Sign Up</NuxtLink>
              </p>
            </div>
            
                          <div class="text-center my-3 authentication-barrier">
                <span>OR</span>
              </div>
            
            <div class="btn-list text-center">
              <button class="btn btn-icon btn-light">
                <i class="ri-facebook-line fw-bold text-dark op-7"></i>
              </button>
              <button class="btn btn-icon btn-light">
                <i class="ri-google-line fw-bold text-dark op-7"></i>
              </button>
              <button class="btn btn-icon btn-light">
                <i class="ri-twitter-line fw-bold text-dark op-7"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'Sign In - Luxota'
})

const { login, loading, error } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.email = ''
  errors.password = ''
  
  // Email validation
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    await login({
      email: form.email,
      password: form.password
    })
    
    // Redirect to dashboard after successful login
    await router.push('/dashboard')
  } catch (err) {
    console.error('Login failed:', err)
    // Handle server validation errors
    if (err.data?.errors) {
      Object.keys(err.data.errors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = err.data.errors[key][0]
        }
      })
    }
  }
}
</script>

<style scoped>
.authentication-barrier {
  position: relative;
}

.authentication-barrier::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e9ecef;
  z-index: 1;
}

.authentication-barrier span {
  background-color: white;
  padding: 0 15px;
  position: relative;
  z-index: 2;
  color: #6c757d;
  font-size: 14px;
}
</style>