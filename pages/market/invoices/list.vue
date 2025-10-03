<template>
  <section class="max-w-7xl mx-auto pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
    <div class="container px-4 mx-auto">
      <div class="flex gap-6">
        <!-- ستون تصویر -->
        <div class="w-3/3">
          <div
              class="rounded-3xl overflow-hidden min-h-[600px]"
              style="background: linear-gradient(145deg, #01132b, #011633);
           box-shadow: 6px 6px 12px #010d1d,
                       -6px -6px 12px #011d43;">
            <div class="overflow-x-auto w-full  p-5">

              <table class="min-w-full shadow-md rounded-lg overflow-hidden">
                <caption class="text-xl font-bold mb-4 text-white-500">My Invoices</caption>
                <thead class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white">
                <tr>
                  <th class="py-3 px-6 text-center text-[12px]">NO.</th>
                  <th class="py-3 px-6 text-center text-[12px]">Invoice No.</th>
                  <th class="py-3 px-6 text-center text-[14px]">Issue Date</th>
                  <th class="py-3 px-6 text-center text-[14px]">Products</th>
                  <th class="py-3 px-6 text-center text-[14px]">Subtotal</th>
                  <th class="py-3 px-6 text-center text-[14px]">Subtotal (USD)</th>
                  <th class="py-3 px-6 text-center text-[14px]">Payment Status</th>
                  <th class="py-3 px-6 text-center text-[14px]">Preview</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in invoices?.data" :key="item.id" class="border-b border-blue-400/50">
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{index+1}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>#LMIN{{item.invoice_code}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{item.date}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]">
                    <div class="flex gap-1 justify-center" v-for="product in item.invoice_items" :key="product.id">
                        <span class="font-light text-[12px]">#{{product.product.product_code}} <b> / </b> </span>
                        <span class="font-light text-[12px]">{{product.product_name}} <b> / </b> </span>
                        <span class="font-light text-[12px]">{{product.duration}} Month <b> / </b></span>
                        <span class="font-light text-[12px]">{{product.quantity}} Pieces</span>
                    </div>
                  </td>
                  <td class="text-center"><p class="text-[12px] font-light">{{numberFormat(item.total * 1.05)}} {{item.currency.abb}}</p></td>
                  <td class="text-center"><p class="text-[12px] font-light">{{numberFormat(item.total_base * 1.05)}} USD</p></td>
                  <td class="text-center">
                    <div v-if="item.status == 1">
                      <span class="bg-green-500 text-white px-2 py-1 rounded text-[9px]">PAID</span>
                    </div>
                    <div v-else-if="item.status == 0">
                      <span class="bg-yellow-500  text-black px-2 py-1 rounded text-[9px]">PENDING</span>
                    </div >
                    <div v-else-if="item.status == 2">
                      <span class="bg-red-500 text-white px-2 py-1 rounded text-[9px]">CANCELED</span>
                    </div >
                    <div v-else-if="item.status == 3">
                      <span class="bg-red-500 text-white px-2 py-1 rounded text-[9px]">UNKNOW</span>
                    </div >
                  </td>
                  <td class="text-center">
                    <nuxt-link class="text-blue-500 text-[12px]" :to="`/market/invoices/${item.invoice_code}`">Invoice Details</nuxt-link>
                  </td>

                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

</template>
<script setup>

import {reactive,ref,watch } from "vue";
import {useRoute} from "vue-router";
import {formatNumber} from "../../../public/dashboard-assets/libs/chart.js/helpers.esm.js";
useHead({
  title: 'Welcome - Luxota'
})
definePageMeta({
  layout:'market',
})
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const xsrfToken = useCookie('XSRF-TOKEN').value
const config = useRuntimeConfig()
const {data:invoices,error,pending,refresh,clear} = useFetch(() => `/invoices/get-invoices-user`,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,
})

const totalPrice = computed(() => {
  return Array.isArray(invoiceItems.value?.data)
      ? invoiceItems.value.data.reduce((sum, item) => sum + Number(item.total), 0)
      : 0
})


function numberFormat(value) {
  if (!value) return ''
  return new Intl.NumberFormat('en-US').format(value)
}
</script>
