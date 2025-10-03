// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        itemCount: 0, // مقدار نمایش در هدر
    }),

    actions: {

        // گرفتن مقدار هدر از API
        async fetchHeaderCount() {
            try {
                const runtime = useRuntimeConfig()
                const xsrfToken = useCookie('XSRF-TOKEN').value
                // $fetch در Nuxt 3 در هر جایی قابل استفاده است
                const data = await $fetch('/invoice/get_invoice_item_count', {
                    baseURL: runtime.public.apiBase,
                    credentials: 'include',
                    headers :{
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                    },
                })

                // فرض می‌کنیم API یا عدد میده یا آبجکت با فیلد مناسب
                if (typeof data === 'number') {
                    this.itemCount = data
                } else if (data && typeof data === 'object') {
                    // اگر API { count: 5 } یا لیست برمی‌گردونه:
                    this.itemCount = data.count ?? (Array.isArray(data) ? data.length : this.itemCount)
                }
            } catch (err) {
                console.error('fetchHeaderCount error:', err)
            }
        },

        // اضافه کردن محصول (می‌تونید payload رو FormData بدید)
        async addToCart(payload, refreshFunc) {
            try {
                const xsrfToken = useCookie('XSRF-TOKEN').value
                const runtime = useRuntimeConfig()
                await $fetch('/invoices/invoice_add_item', {
                    method: 'POST',
                    baseURL: runtime.public.apiBase,
                    credentials: 'include',
                    headers :{
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                    },
                    body: payload,
                })

                await this.fetchHeaderCount()
                if (typeof refreshFunc === 'function') refreshFunc()
            } catch (err) {
                console.error('addToCart error:', err)
                throw err
            }
        },

        // حذف محصول
        async removeItem(itemId, refreshFunc) {
            try {
                const runtime = useRuntimeConfig()
                const xsrfToken = useCookie('XSRF-TOKEN').value
                await $fetch(`/invoices/invoice_remove_item/${itemId}`, {
                    method: 'DELETE',
                    baseURL: runtime.public.apiBase,
                    credentials: 'include',
                    headers :{
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
                    },
                })

                await this.fetchHeaderCount()
                if (typeof refreshFunc === 'function') refreshFunc()
            } catch (err) {
                console.error('removeItem error:', err)
                throw err
            }
        }
    }
})
