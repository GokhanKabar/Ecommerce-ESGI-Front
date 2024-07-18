<script setup lang="ts">
import store from '@/store/store'
import { onClickOutside } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import getImagePath from '@/utils/getImagePath'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

const target = ref(null)
const dropdownOpen = ref(false)
const showLoginMessage = ref(false)

defineProps({
  sideBarType: String
})

onClickOutside(target, () => {
  dropdownOpen.value = false
})

const incrementQuantity = (productId) => {
  store.dispatch('incrementProductQuantity', productId)
}

const decrementQuantity = (productId) => {
  store.dispatch('decrementProductQuantity', productId)
}

const cartProducts = computed(() => store.state.cart)
const isUserLoggedIn = computed(() => store.state.isUserLoggedIn)

const totalPrice = computed(() => {
  console.log('store.state.cart', store.state.cart)
  return store.state.cart
    .reduce((total, item) => {
      const { product } = item
      const quantity = product.quantity || 0
      const price = parseFloat(product.price)
      let itemTotal = quantity * price
      return total + itemTotal
    }, 0)
    .toFixed(2)
})

const totalProducts = computed(() => store.state.cart.length)
const router = useRouter()

const createCheckoutSession = async () => {
  showLoginMessage.value = false

  if (!isUserLoggedIn.value) {
    showLoginMessage.value = true
    return
  }

  const stripe = await stripePromise
  const response = await fetch('http://localhost:8000/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: cartProducts.value.map((item) => ({
        productId: item.product.id, // Assurez-vous que productId est inclus
        name: item.product.name,
        amount: parseFloat(item.product.price),
        quantity: item.product.quantity
      }))
    })
  })

  const session = await response.json()

  if (session.error) {
    console.error(session.error)
    return
  }

  const result = await stripe.redirectToCheckout({ sessionId: session.id })

  if (result.error) {
    console.error(result.error.message)
  }
}

</script>

<template>
  <div :class="['nav-item ', sideBarType === 'back' ? 'mt-2' :'' ]" >
    <a href="#" class="flex flex-row gap-1">
      <svg
        :width="sideBarType === 'back' ? 27 : 17" :height="sideBarType === 'back' ? 27 : 17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2_479)">
          <path
            d="M13.578 5.734C13.578 3.19 11.514 1.126 8.96998 1.126C6.42598 1.126 4.36198 3.19 4.36198 5.734H1.28998L3.33798 15.974H14.602L16.65 5.734H13.578ZM6.40998 5.734C6.40998 4.3228 7.55878 3.174 8.96998 3.174C10.3812 3.174 11.53 4.3228 11.53 5.734H6.40998Z"
            fill="#D8B775"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_479">
            <rect width="16" height="16" fill="white" transform="translate(0.969971 0.549999)" />
          </clipPath>
        </defs>
      </svg>
      <div class="relative" ref="target">
        <span
          @click.prevent="dropdownOpen = !dropdownOpen"
          :class="['hidden md:inline-block hover:text-[#D8B775] font-semibold', sideBarType === 'back' ? 'text-black mt-1' : 'text-white']"
        >
          MON PANIER ({{ totalProducts }})
        </span>
        <div
          v-show="dropdownOpen"
          class="absolute right-0 mt-4 flex w-80 flex-col rounded-sm border border-stroke bg-white shadow-default z-50"
        >
          <ul v-if="cartProducts.length" class="flex flex-col gap-5 border-b border-stroke px-4 py-4 max-h-64 overflow-y-auto">
            <li
              v-for="item in cartProducts"
              :key="item.product.id"
              class="flex items-center gap-3.5"
            >
              <img
                :src="getImagePath(item.product.image)"
                alt="Product Image"
                class="h-12 w-12 object-cover rounded"
              />
              <div class="flex flex-col">
                <span class="text-sm font-medium">{{ item.product.name }}</span>
                <span class="text-xs font-medium">{{ item.product.price }}</span>
              </div>
              <div class="flex-col items-center gap-2 ml-auto">
                <button
                  @click="decrementQuantity(item.product.id)"
                  class="w-6 h-6 px-2 mx-3.5 bg-[#D8B775] text-white rounded-full"
                >
                  -
                </button>
                <span>{{ item.product.quantity }}</span>
                <button
                  @click="incrementQuantity(item.product.id)"
                  class="w-6 h-6 px-2 mx-3.5 bg-[#D8B775] text-white rounded-full"
                >
                  +
                </button>
              </div>
            </li>
          </ul>
          <div v-else class="px-6 py-4 text-center text-gray-500">
            Votre panier est vide.
          </div>
          <div v-if="cartProducts.length" class="flex justify-between px-6 py-4">
            <span class="text-sm font-semibold text-xl">Total:</span>
            <span class="text-sm font-semibold text-xl">{{ totalPrice }} €</span>
          </div>
          <div class="px-6 py-4">
            <button
              @click="createCheckoutSession"
              :disabled="!cartProducts.length"
              class="w-full py-2 bg-[#D8B775] text-white font-semibold rounded"
            >
              Commander
            </button>
            <div v-if="showLoginMessage" class="mt-4 text-center">
              <p class="text-gray-700">Vous devez être connecté pour pouvoir commander.</p>
              <router-link to="/connexion" class="text-[#D8B775] font-semibold hover:underline"
                >Se connecter</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
