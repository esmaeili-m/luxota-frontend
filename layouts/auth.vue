<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Set up the layout
</script>

<style>
/* Custom styles for authentication pages */
body {
  background-color: #f8f9fa;
}

.authentication {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.custom-card {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.75rem;
}

.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}

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
  background-color: #e5e7eb;
  z-index: 1;
}

.authentication-barrier span {
  background-color: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
  color: #6b7280;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.25rem;
}

.op-7 {
  opacity: 0.7;
}
</style> 