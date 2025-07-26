export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()
    await $fetch(`http://localhost:8000/sanctum/csrf-cookie`, {
        credentials: 'include'
    })
})
