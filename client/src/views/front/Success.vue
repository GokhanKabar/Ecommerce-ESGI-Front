<script setup>
import store from '@/store/store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import OrderService from '../../services/OrderService';


const route = useRoute()

onMounted( async () => {
 

  const sessionId = route.query.session_id
  console.log(sessionId)


  try {
    // Vérifiez le statut du paiement avec votre backend
    const response = await fetch(`http://localhost:8000/stripe/checkout-session/${sessionId}`)
    const session = await response.json()

    if (session.payment_status === 'paid') {
      // Créez la commande dans votre backend avec des informations supplémentaires
      const orderData = {
        userId: store.state.user.id,
        products: store.state.cart.map(item => ({
          productId: item.product.id,
          quantity: item.product.quantity,
          price: item.product.discountedPrice || item.product.price
        })),
      }
      
      await OrderService.createOrder(orderData)
      
      // Vider le panier après la création de la commande
      store.dispatch('clearCart')
    } else {
      console.error('Payment not successful')
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
  }




})
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <h1 class="text-4xl font-bold mb-4">Paiement Réussi!</h1>
      <p class="text-lg">Merci pour votre achat. Votre commande a été traitée avec succès.</p>
      <router-link to="/" class="mt-4 bg-[#D8B775] text-white px-4 py-2 rounded hover:bg-secondary">
        Retour à l'accueil
      </router-link>
    </div>
  </DefaultLayout>
</template>
