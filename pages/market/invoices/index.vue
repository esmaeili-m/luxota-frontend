<template>
  <section class="max-w-7xl mx-auto pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
    <div class="container px-4 mx-auto">
      <div class="flex gap-6">
        <!-- ستون تصویر -->
        <div class="w-2/3">
          <div
              class="rounded-3xl overflow-hidden min-h-[600px]"
              style="background: linear-gradient(145deg, #01132b, #011633);
           box-shadow: 6px 6px 12px #010d1d,
                       -6px -6px 12px #011d43;">
            <div class="overflow-x-auto w-full max-w-4xl p-5">

              <table class="min-w-full shadow-md rounded-lg overflow-hidden">
                <caption class="text-xl font-bold mb-4 text-white-500">My Shopping Cart</caption>
                <thead class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white">
                <tr>
                  <th class="py-3 px-6 text-center text-[12px]">NO.</th>
                  <th class="py-3 px-6 text-center text-[12px]">Product</th>
                  <th class="py-3 px-6 text-center text-[14px]">Duration</th>
                  <th class="py-3 px-6 text-center text-[14px]">Price</th>
                  <th class="py-3 px-6 text-center text-[14px]">Count</th>
                  <th class="py-3 px-6 text-center text-[14px]">Agency Remark</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in invoiceItems?.data" :key="item.id" class="border-b border-blue-400/50">
                  <td class="py-3 px-6 text-center font-bold  text-[12px]">1</td>
                  <td class="py-3 px-6 text-center font-bold  text-[12px]">
                    <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <svg style="  color: #ec4a4a;cursor: pointer" @click="remove_item(item.id)" width="15px" height="15px" viewBox="0 0 17 17" fill="#000" xmlns="http://www.w3.org/2000/svg" class="si-glyph si-glyph-delete">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <path d="M12.566,8 L15.611,4.956 C16.031,4.535 16.031,3.853 15.611,3.434 L12.566,0.389 C12.146,-0.031 11.464,-0.031 11.043,0.389 L7.999,3.433 L4.955,0.389 C4.534,-0.031 3.852,-0.031 3.432,0.389 L0.388,3.434 C-0.034,3.854 -0.034,4.536 0.387,4.956 L3.431,8 L0.387,11.044 C-0.034,11.465 -0.034,12.147 0.388,12.567 L3.432,15.611 C3.852,16.032 4.534,16.032 4.955,15.611 L7.999,12.567 L11.043,15.611 C11.464,16.032 12.146,16.032 12.566,15.611 L15.611,12.567 C16.031,12.146 16.031,11.464 15.611,11.044 L12.566,8 L12.566,8 Z" fill="currentColor"/>
                        </g>
                      </svg>
                      <span class="text-[12px]">{{ item.product_name }} </span>
                    </div>
                  </td>

                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{item.duration}} Month</td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">{{numberFormat(item.total)}} {{item?.currency?.abb}} </td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">
                    <input :class="item.id" min="1"  class="border border-solid rounded-lg p-2 w-20 focus:outline-none focus:ring-0 focus:border-blue-500" type="number" v-model="quantits[item.id]">
                  </td>
                  <td class="py-3 px-6 text-center font-bold text-[12px]">
                    <textarea v-model="remarks[index]"  class="border border-solid rounded-lg p-3 w-full focus:outline-none focus:ring-0 focus:border-blue-500" rows="3"></textarea>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>


        <!-- ستون کناری -->
        <div class="w-1/3 ">
          <div class="p-3 rounded-3xl" style="background: linear-gradient(145deg, #01132b, #011633);
           box-shadow: 6px 6px 12px #010d1d,
                       -6px -6px 12px #011d43;">

            <div class="p-2 text-center">
                <p class="text-[16px] opacity-70 font-bold">Invoice To {{user}}</p>
                <p class="mt-4 text-[20px] font-bold">{{ numberFormat(totalPrice) }} <spna class="font-bold text-[16px]" v-if="invoiceItems?.data?.length > 0">{{invoiceItems?.data[0].currency?.abb}}</spna></p>
                <p class="text-[16px] opacity-70">Total Amount Payable</p>
              <button @click="handleSubmit" class="mb-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white
              bg-gradient-to-r from-green-600 to-green-800
              hover:from-green-700 hover:to-green-900
              rounded-lg mt-2 cursor-pointer
              transition-all duration-300">
                Confirm Order & Issue the Invoice
              </button>
              <p class="text-[13px] opacity-70">By confirmation the order, the invoice will generate and will send you to clear.</p>


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
const hoverCard = ref(null)
const xsrfToken = useCookie('XSRF-TOKEN').value
const config = useRuntimeConfig()
const remarks = ref ([])
const quantits = reactive ({})


const errors = reactive({
  title: "",
});

const isSubmitting = ref(false);
const user = computed(() => {
  return auth.user?.user?.name
})

const validate = () => {
  let valid = true;
  if (Object.keys(quantits).length !== invoiceItems?.value?.data?.length) {
    errors.title = "Please check, this field is required.";
    valid = false;
  }
  return valid;
};


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
let timeout;

watch(
    () => quantits,
    (newVal, oldVal) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (invoiceItems?.value?.data && Array.isArray(invoiceItems?.value?.data)) {
          invoiceItems?.value?.data.forEach(item => {
            if (quantits[item.id] && quantits[item.id] > 0) {
              const quantity = Number(quantits[item.id] || 1);
              const total = Number(item.total || 0);
              item.total = quantity * total;
            }
          });
        }
      }, 1500);
    },
    { deep: true }
);




const totalPrice = computed(() => {
  return Array.isArray(invoiceItems.value?.data)
      ? invoiceItems.value.data.reduce((sum, item) => sum + Number(item.total), 0)
      : 0
})


function numberFormat(value) {
  if (!value) return ''
  return new Intl.NumberFormat('en-US').format(value)
}

async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;

  const payload = {
    remarks: remarks.value,
    quantits: quantits
  }
  const { data, error } = await useFetch("/invoices", {
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
    console.error(error.value);
    alert("Error while submitting comment ❌");
  } else {

    router.push(`/market/invoices/${data.value.data.invoice_code}`);
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
