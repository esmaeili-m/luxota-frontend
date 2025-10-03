<template>
  <section class="max-w-7xl mx-auto pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
    <div class="container px-4 mx-auto">
      <div class="flex gap-6">
        <!-- ستون تصویر -->
        <div class="w-3/3">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold text-[30px]">Vouchers List</p>
            </div>
              <form @submit.prevent="handleSubmit" class=" p-6  rounded-xl  space-y-6">
                <div class="flex gap-2">

                <div>
                  <input class="p-4 w-full bg-transparent placeholder:text-slate-400 text-white
                       text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300
                        ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                         placeholder="Type Code..."
                         v-model="form.code"/>
                  <p v-if="errors.code" class="text-red-500 text-sm mt-1">{{ errors.code }}</p>

                </div>
                <div>
                  <button type="submit" class="cursor-pointer w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Redeem Now!
                  </button>
                </div>
                </div>

              </form>
          </div>
          <hr>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div>
                  <div class="p-3 mx-6 bg-gradient-to-r from-indigo-600 to-indigo-500 mt-5 rounded-t-lg text-center">
                    <p class="text-[18px] font-bold">e - Wallet</p>
                  </div>
                <div >
                <div class="p-3 border border-indigo-500 rounded-lg">
                    <div class="flex gap-3">
                      <img alt="voucher" width="100px" height="100px" src="/market-assets/images/footer/thumb-Voucher icon.png">
                      <div>
                        <p class="text-[30px] font-bold">{{calculateVoucherBalance(voucher?.transactionsWallet)}} USD</p>
                        <p class="text-[15px] font-normal">EXP Lifetime!</p>
                        <NuxtLink
                            to="/market/invoices/transactions/wallet"
                            class="font-bold cursor-pointer w-full py-2 px-4 bg-sky-500 text-white rounded-md shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-center block"
                        >
                          Account Ledger
                        </NuxtLink>
                      </div>
                    </div>
                 </div>
                </div>
              </div>
            <div v-for="voucher in vouchers?.data" :key="voucher.id"  :class="{'opacity-50 grayscale': voucher?.expire}" >
                  <div class="p-3 mx-6 bg-gradient-to-r from-sky-600 to-sky-500 mt-5 rounded-t-lg text-center">
                    <p class="text-[18px] font-bold">{{voucher.title}}</p>
                  </div>
                <div >
                <div class="p-3 border border-sky-500 rounded-lg">
                    <div class="flex gap-3">
                      <img alt="voucher" width="100px" height="100px" src="/market-assets/images/footer/thumb-Voucher icon.png">
                      <div>
                        <p class="text-[30px] font-bold">{{calculateVoucherBalance(voucher?.transactions)}} USD</p>
                        <p class="text-[15px] font-normal">Expires on: {{voucher?.expire ? 'Expire' : voucher?.expires_at}}</p>
                        <NuxtLink
                            :to="`/market/invoices/transactions/${voucher.voucher_id}`"
                            class="font-bold cursor-pointer w-full py-2 px-4 bg-sky-500 text-white rounded-md shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-center block"
                        >
                          Account Ledger
                        </NuxtLink>

                      </div>
                    </div>
                 </div>
                </div>
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
const form = reactive({
  'code': '',
})

const errors = reactive({
  code: "",
});
const {data:vouchers,error,pending,refresh,clear} = useFetch(() => `/invoices/get-vouchers-user`,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,
  key: false,
})
const {data:transactionsWallet,errorTransactionsWallet,pendingTransactionsWallet,refreshTransactionsWallet,clearTransactionsWallet} = useFetch(() => `/invoices/get-transactions-user-wallet`,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,
  key: false,
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
function calculateVoucherBalance(transactions) {
  const list = transactions || []
  return list.reduce((sum, t) => sum + (t.credit - t.debit), 0)
}

const validate = () => {
  let valid = true;
  if (form.code == '') {
    errors.code = "Please check, this field is required.";
    valid = false;
  }
  return valid;
};
async function handleSubmit() {
  if (!validate()) return;

  const { data, error } = await useFetch("/invoices/redeem-voucher", {
    method: "POST",
    baseURL: config.public.apiBase,
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
    },
    credentials: "include",
  });

  if (error.value) {
    console.error(error.value);

    errors.code = error.value?.data?.errors?.code?.[0] || "Something went wrong";
    alert("Error while submitting voucher ❌");
  } else {
    alert("Voucher submitted successfully ✅");
    form.code = "";
    errors.code = "";
    refresh()
  }
}

</script>
