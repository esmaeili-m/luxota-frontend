<template>
  <section class="max-w-7xl mx-auto pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
    <div class="container px-4 mx-auto">
          <div
              class="rounded-3xl overflow-hidden min-h-[900px]"
              style="background: linear-gradient(145deg, #01132b, #011633);
           box-shadow: 6px 6px 12px #010d1d,
                       -6px -6px 12px #011d43;">
            <div class=" bg-gradient-to-r from-cyan-800 via-cyan-900 to-sky-800 w-full p-5">
                <p class="text-center text-[30px] font-bold mb-4 text-white-500" >INVOICE</p>
                <div class="mt-5 flex justify-between">
                    <div class="flex gap-3">
                        <img width="200px" height="200px" class="rounded-lg" src="/market-assets/images/logo/Untitled1 copy.png" alt="logo">
                        <div>
                          <p class="mb-0 font-bold">Luxota Travel Tech. UAE.</p>
                          <p class="mb-0 font-thin text-[14px]">Office#1, 17th Floor, BayGate Tower, Business Bay, Dubai, UAE.</p>
                          <p class="mb-0 font-thin text-[14px]">+971 (4) 526 9889</p>
                          <p class="mb-0 font-thin text-[14px]">finance@luxotatraveltech.com</p>
                          <p class="mb-0 font-thin text-[14px]">https://luxotatraveltech.com</p>
                        </div>
                    </div>
                    <div>
                      <p class="mb-0 "><b>Date:</b> {{invoice?.data?.date}}</p>
                      <p class="mb-0 mt-1 text-[14px]"><b>NO:</b> #LMIN{{invoice?.data?.invoice_code}}</p>
                      <p class="mb-0  mt-1 text-[14px]"><b>Payment: </b><span class="bg-red-500 text-white px-2 py-1 rounded ">{{ invoice_status(invoice?.data.status) }}</span></p>

                    </div>

                </div>
            </div>
            <div class="overflow-x-auto w-full  p-5">

              <table class="min-w-full shadow-md rounded-lg overflow-hidden">
                <caption class="text-xl font-bold mb-4 text-white-500">PRODUCTS</caption>
                <thead class=" bg-gradient-to-r from-cyan-800 via-cyan-900 to-sky-800 w-full text-white">
                <tr>
                  <th class="py-3 px-6 text-center text-[12px]">NO.</th>
                  <th class="py-3 px-6 text-center text-[12px]">Product</th>
                  <th class="py-3 px-6 text-center text-[14px]">Duration</th>
                  <th class="py-3 px-6 text-center text-[14px]">Remark</th>
                  <th class="py-3 px-6 text-center text-[14px]">Quantity</th>
                  <th class="py-3 px-6 text-center text-[14px]">Unit Price</th>
                  <th class="py-3 px-6 text-center text-[14px]">Total</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in invoice?.data?.invoice_items" :key="item.id" class="border-b border-blue-400/50">
                  <td class="py-3 px-6 text-center font-bold  text-[12px]">1</td>
                  <td class="py-3 px-6 text-center font-bold  text-[12px]">
                    <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <span class="text-[12px]">{{ item.product_name }}</span> <span class="bg-red-500 text-white px-2 py-1 rounded  text-[10px]">{{ discount(item?.discount_factor)}}% OFF</span>
                    </div>
                  </td>

                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{item.duration}} Month</td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{item.remark}} </td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{item.quantity}} </td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{numberFormat(item.unit_price)}} {{invoice?.data?.currency?.abb}}</td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{numberFormat(item.total)}} {{invoice?.data?.currency?.abb}} </td>

                </tr>
                </tbody>

              </table>
              <footer class="w-full  py-2 mt-auto justify-between flex" >
                <div></div>
                <div>
                  <div class="text-right pr-4">
                    <div class="justify-between flex  gap-4">
                      <p>SUBTOTAL</p>
                      <p>{{ numberFormat(subtotal) }}</p>
                    </div>

                    <div class="justify-between flex mt-2 gap-4">
                      <p>TAX/VAT RATE</p>
                      <p>5%</p>
                    </div>

                    <div class="justify-between flex mt-2 gap-4">
                      <p>TOTAL TAX/VAT</p>
                      <p>{{ numberFormat(tax) }}</p>
                    </div>
                    <hr class="bg-gray-300">

                    <div class="justify-between flex mt-2 font-bold gap-4">
                      <p>TOTAL AMOUNT PAYABLE</p>
                      <p>{{ numberFormat(totalPrice) }} {{invoice?.data?.currency?.abb}}</p>
                    </div>
                    <div class="justify-between flex mt-2 font-bold gap-4">
                    <p>TOTAL AMOUNT PAYABLE (USD)</p>
                    <p>{{ numberFormat(totalPriceUSD) }} USD</p>
                  </div>
                    <div class="text-center bg-gray-300 mt-2 font-bold  text-gray-500 rounded  text-[13px]" >
                      Payment Sources Allocation
                    </div>
                    <div>

                    </div>
                    <hr class="bg-gray-300 mt-2">

                    <button   class=" mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white
                        bg-gradient-to-r from-blue-600 to-blue-800
                        hover:from-blue-700 hover:to-blue-900
                        rounded-lg cursor-pointer
                        transition-all duration-300">
                      <svg width="20ps" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 0h48v48H0z" fill="none"></path> <g id="Shopicon"> <path d="M13,4h-3C7.8,4,6,5.8,6,8v23.955c0,2.2,1.8,4,4,4h3V4z"></path> <path d="M40.228,21.494L30,11.267V8c0-2.2-1.8-4-4-4h-7v31.955h7c2.2,0,4-1.8,4-4v-3.712l2.12,2.12l2.829-2.828l-4.663-4.663 l-6.301-6.301c-0.378-0.378-0.585-0.884-0.584-1.424c0.001-0.534,0.207-1.033,0.584-1.408c0.754-0.755,2.079-0.753,2.832,0 L31,17.923l6.416,6.416l-0.072-0.022l0.109,0.072C37.584,24.586,38,25.337,38,26.955v13H22c-1.915,0-3.605-1.633-3.933-3.799 L18.044,36h-4.045l0.114,0.754c0.621,4.105,4.012,7.201,7.888,7.201h20v-17C42,23.483,40.656,21.907,40.228,21.494z"></path> </g> </g></svg>
                      Clear Invoice
                    </button>
                  </div>
                </div>

              </footer>
              <div class="flex gap-5  items-end">
                <button    class=" mt-2 flex items-center justify-center gap-2 px-8 py-4 text-[24px] font-medium text-white
                        bg-gradient-to-r from-blue-600 to-blue-800
                        hover:from-blue-700 hover:to-blue-900
                        rounded-lg cursor-pointer
                        transition-all duration-300">
                  {{ numberFormat(totalPrice) }} {{invoice?.data?.currency?.abb}}
                </button>
                <button   @click="showModal = true"  class=" mt-2 flex items-center justify-center gap-2 px-6 py-3 text-[16px] font-medium text-white
                        bg-gradient-to-r from-green-600 to-green-800
                        hover:from-green-700 hover:to-green-900
                        rounded-lg cursor-pointer
                        transition-all duration-300">
                  Split Payment Allocation
                </button>
              </div>
            </div>

          </div>
    </div>
  </section>
  <div v-if="showModal"
       class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div style="background-color: rgb(1, 21, 48) !important" class=" shadow-xl  w-1/2 rounded-3xl p-6 relative">

      <!-- دکمه بستن -->
      <button @click="showModal = false"
              class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">
        ×
      </button>

      <!-- محتوای مدال -->
      <h2 class="text-lg font-bold mb-2 ">Split Payment Allocation</h2>
      <hr class="bg-red-500">
      <div class="mt-3 grid grid-cols-[200px_1fr] gap-y-5  gap-x-20 items-start">
        <!-- سطر 1: Payment Account -->
        <p>Select Payment Account:</p>
        <div class="">
            <input name="account" type="radio" id="wallet" value="wallet" v-model="payment_account" />
            <label class="ml-5" for="wallet">e - WALLET</label>
          <div v-for="voucher in validVouchers" :key="voucher.id" :class="{'opacity-50 grayscale': voucher?.expire}" class="mt-2">
            <input name="account" type="radio" :id="voucher.id" :value="voucher?.id" v-model="payment_account" />
            <label  class="ml-5" :for="voucher?.id">Balance <b class="text-red-500"> {{calculateVoucherBalance(voucher?.transactions)}} USD</b>  From {{ voucher.title }} Voucher, Exp: {{voucher.expires_at}}</label>
          </div>
          <p class="text-red-400" v-if="errors.payment_account">{{errors.payment_account}}</p>

        </div>

        <p>Amount to pay:</p>
        <div>
          <input
              type="number"
              min="1"
              v-model="amount"
              class="border border-solid rounded-lg p-2 w-32 focus:outline-none focus:ring-0 focus:border-blue-500"
          />
          <p class="text-red-400" v-if="errors.amount">{{errors.amount}}</p>
        </div>


      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button  @click="handleSubmit()"  class=" mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white
                        bg-gradient-to-r from-blue-600 to-blue-800
                        hover:from-blue-700 hover:to-blue-900
                        rounded-lg cursor-pointer
                        transition-all duration-300">
          Submit
        </button>
        <button @click="showModal = false"  class=" mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white
                        bg-gradient-to-r from-red-600 to-red-800
                        hover:from-red-700 hover:to-red-900
                        rounded-lg cursor-pointer
                        transition-all duration-300">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>

import {reactive,ref,watch } from "vue";
import {useRoute} from "vue-router";
useHead({
  title: 'Welcome - Luxota'
})
definePageMeta({
  layout:'market',
})
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const showModal = ref(false)

const hoverCard = ref(null)
const xsrfToken = useCookie('XSRF-TOKEN').value
const config = useRuntimeConfig()



const amount = ref('')
const payment_account = ref('')

const errors = reactive({
  amount: '',
  payment_account: ''
})

const validate = () => {
  let valid = true

  // پاک کردن ارور قبلی
  errors.amount = ""
  errors.payment_account = ""

  if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
    errors.amount = "Please enter a valid amount greater than 0."
    valid = false
  }

  if (!payment_account.value) {
    errors.payment_account = "Please check, this field is required."
    valid = false
  }

  return valid
}
const isSubmitting = ref(false);
const user = computed(() => {
  return auth.user?.user?.name
})

const invoiceCode = route.params.id || '';
const {data:invoiceItems = [],error,pending,refresh,clear} = useFetch(() => `/invoices/invoiceItem`,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,
  default: () => ({ data: [] }),
  onResponse({ response }) {
    response._data.data.forEach(item => {
      quantits[item.id] = item.quantity

    })
  },

})
const {data:invoice,errorInvoice,pendingInvoice,refreshInvoice,clearInvoice} = useFetch(() => invoiceCode ? `/invoices/find-by-invoice-code/${invoiceCode}` : null,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,

})
const {data:vouchers,errorVouchers,pendingVouchers,refreshVouchers,clearVouchers} = useFetch(() => `/invoices/get-vouchers-user`,{
  baseURL: config.public.apiBase,
  credentials: 'include',
  headers :{
    Accept: 'application/json',
    'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
  },
  server:false,
})
const validVouchers = computed(() => {
  const now = new Date()
  return vouchers.value?.data.filter(voucher => {
    return new Date(voucher.expires_at) >= now
  })
})
const subtotal = computed(() => {
  const items = invoice.value?.data?.invoice_items
  if (!Array.isArray(items)) return 0
  return items.reduce((total, item) => total + Number(item.total || 0), 0)
})

const tax = computed(() => subtotal.value * 0.05)

const totalPrice = computed(() => subtotal.value + tax.value)
function calculateVoucherBalance(transactions) {
  const list = transactions || []
  return list.reduce((sum, t) => sum + (t.credit - t.debit), 0)
}
const taxUSD = computed(() => {
  return invoice.value?.data?.total_base ? invoice.value.data?.total_base * 0.05 : 0
})

const totalPriceUSD = computed(() => {
  return invoice.value?.data?.total_base ? invoice.value.data?.total_base + taxUSD.value : 0
})
function numberFormat(value) {
  if (!value) return ''
  return new Intl.NumberFormat('en-US').format(value)
}
function invoice_status(status){
  if (status == 0){
    return 'UNPAID'
  }else if(status == 1){
    return 'PAID'
  }else {
    return 'CANCELED'
  }
}
function discount(discount_factor){

  const factor = parseFloat(discount_factor ?? 1);
  return Math.round((1 - factor) * 100);


}
async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;
  const payload = {
    invoice_id: invoice.value?.data?.id,
    amount: amount.value,
    method: payment_account.value == 'wallet' ? 1 : 2,
    voucher_id: payment_account.value == 'wallet' ? null : payment_account.value,
  }
  const { data, error } = await useFetch("/invoices/tranaction-item", {
    method: "POST",
    baseURL: config.public.apiBase,
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
    },
    credentials: "include",
  });

  if (error.value) {
    const errorsResponse = error.value.data?.errors;
    if (errors) {
      Object.entries(errorsResponse).forEach(([field, messages]) => {
        if (errors[field] !== undefined) {
          errors[field] = messages[0];
        }
      });
    } else {
      alert(error.value.data?.message || "خطای ناشناخته‌ای رخ داده است ❌");
    }
  } else {
  }

  isSubmitting.value = false;
}

async function removeProduct() {
}
async function add_to_card(duration){
  const payload = new FormData()
  payload.append('duration', duration)
  payload.append('product_id', form.product_id)
  await cart.addToCart(payload)
  refresh()
}
async function remove_item(item){
  await cart.removeItem(item)
  refresh()
}
</script>
