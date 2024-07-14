<script setup lang="ts">
import store from '@/store/store';
import { onClickOutside } from '@vueuse/core'
import { ref, computed } from 'vue'

// Assuming your store has a `cart` state with products
const target = ref(null)
const dropdownOpen = ref(false)


onClickOutside(target, () => {
  dropdownOpen.value = false
})

const incrementQuantity = (product) => {
  store.dispatch('incrementProductQuantity', product)
}

const decrementQuantity = (product) => {
  store.dispatch('decrementProductQuantity', product)
}

const cartProducts = computed(() => store.state.cart)


const totalPrice = computed(() => {
      return store.state.cart.reduce((total, item) => {
        // Extraire le produit et la quantité
        const { product } = item;
        const quantity = product.quantity || 0;

        // Convertir le prix en nombre (en enlevant le format monétaire)
        const price = parseFloat(product.price.replace(/[^0-9.,]/g, '').replace(',', '.'));

        // Calculer le montant pour cet article
        let itemTotal = quantity * price;

        // Ajouter le montant de cet article au total de la commande
        return total + itemTotal;
      }, 0).toFixed(2); // Formater le résultat avec deux décimales
    });



const totalProducts=computed(() => 
  store.state.cart.length 
)

</script>

<template>
  <div class="nav-item">
    <a href="#" class="flex flex-row gap-1">
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <!-- Dropdown Start -->
        <span
          @click.prevent="dropdownOpen = !dropdownOpen"
          class="hidden md:inline-block text-white hover:text-[#D8B775] font-semibold"
        >
          MON PANIER ({{ totalProducts }})
        </span>
        <div
          v-show="dropdownOpen"
          class="absolute right-0 mt-4 flex w-80 flex-col rounded-sm border border-stroke bg-white shadow-default z-50"
        >
          <ul class="flex flex-col gap-5 border-b border-stroke px-4 py-4">
            <li v-for="item in cartProducts" :key="item.product.id" class="flex items-center gap-3.5">
              <img :src="item.product.image" alt="Product Image" class="h-12 w-12 object-cover rounded" />
              <div class="flex flex-col">
                <span class="text-sm font-medium">{{ item.product.name }}</span>
                <span class="text-xs font-medium">{{ item.product.price }}</span>
              </div>
              <div class="flex-col items-center gap-2 ml-auto">
               
                <button @click="decrementQuantity(item.product.id)" class="w-6 h-6 px-2 mx-3.5 bg-[#D8B775] text-white rounded-full">-</button>
                <span>{{ item.product.quantity }}</span>
                <button @click="incrementQuantity(item.product.id)" class="w-6 h-6 px-2 mx-3.5 bg-[#D8B775] text-white rounded-full">+</button>
              </div>
            </li>
          </ul>
          <div class="flex justify-between px-6 py-4">
            <span class="text-sm font-semibold text-xl">Total:</span>
            <span class="text-sm font-semibold text-xl">{{ totalPrice }} €</span>
          </div>
          <div class="px-6 py-4">
            
            <button class="w-full py-2 bg-[#D8B775] text-white font-semibold rounded">Commander</button>
          </div>
        </div>
        <!-- Dropdown End -->
      </div>
    </a>
  </div>
</template>

