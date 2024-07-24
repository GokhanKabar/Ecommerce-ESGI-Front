<script setup lang="ts">
import store from '@/store/store'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import getImagePath from '@/utils/getImagePath'
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

const showLoginMessage = ref(false)

const cartProducts = computed(() => store.state.cart)
const isUserLoggedIn = computed(() => store.state.isUserLoggedIn)

const totalPrice = computed(() => {
  return store.state.cart
    .reduce((total, item) => {
      const { product } = item
      const quantity = product.quantity || 0
      const priceString = product.price.replace(',', '.').replace(/[^0-9.]/g, '')
      const price = parseFloat(priceString)
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
  const response = await fetch(
    `http://localhost:8000/stripe/create-checkout-session/${store.state.user.id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: store.state.user.firstName,
        lastName: store.state.user.lastName,
        address: store.state.user.address,
        items: cartProducts.value.map((item) => ({
          productId: item.product.id, // Assurez-vous que productId est inclus
          name: item.product.name,
          amount: parseFloat(item.product.price.replace(',', '.').replace(/[^0-9.]/g, '')),
          quantity: item.product.quantity
        }))
      })
    }
  )
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
  <DefaultLayout>
    <div class="container mx-auto my-8 p-4">
      <h1 class="text-4xl font-bold mb-8">Récapitulatif de la commande</h1>
      <div class="flex flex-col items-center justify-center">
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartProducts" :key="item.product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="getImagePath(item.product.image)" alt="Product Image" class="h-16 w-16 object-cover rounded-md">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.product.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.product.price }} €</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.product.quantity }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ (parseFloat(item.product.price.replace(',', '.').replace(/[^0-9.]/g, '')) * item.product.quantity).toFixed(2) }} €</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-8 w-full text-right">
          <div class="text-xl font-bold mb-4">Total: {{ totalPrice }} €</div>
          <button @click="createCheckoutSession" class="bg-[#D8B775] text-white px-4 py-2 rounded hover:bg-secondary">
            Passer au paiement
          </button>
        </div>
        <div v-if="showLoginMessage" class="text-red-500 mt-4">Veuillez vous connecter pour continuer.</div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
</style>
