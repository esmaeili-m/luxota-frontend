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
                <caption class="text-xl font-bold mb-4 text-white-500">Transactions Voucher</caption>
                <thead class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white">
                <tr>
                  <th class="py-3 px-6 text-center text-[14px]">NO.</th>
                  <th class="py-3 px-6 text-center text-[14px]">Date</th>
                  <th class="py-3 px-6 text-center text-[14px]">Remark</th>
                  <th class="py-3 px-6 text-center text-[14px]">Debit</th>
                  <th class="py-3 px-6 text-center text-[14px]">Credit</th>
                  <th class="py-3 px-6 text-center text-[14px]">Balance</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(transaction, index) in transactions?.data" :key="transaction.id" class="border-b border-blue-400/50">
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{index+1}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{transaction.created_at}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{transaction.remark}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{transaction.debit}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{transaction.credit}}</p></td>
                  <td class="py-3 px-6 text-center font-light  text-[12px]"><p>{{transaction.balance}}</p></td>
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
const transaction = route.params.id || '';
const {data:transactions,error,pending,refresh,clear} = useFetch(() => `/invoices/get-transactions-user/${transaction}`,{
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
