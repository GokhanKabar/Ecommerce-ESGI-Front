<script setup lang="ts">
import { defineProps } from 'vue'
import { type Product } from '@/types/products.types'
import getImagePath from '@/utils/getImagePath'

interface Props {
  product: Product
}

const props = defineProps<Props>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

<template>
  <div class="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
    <a :href="`/product/${product._id}`">
      <img
        :src="getImagePath(product.image)"
        :alt="product.name"
        class="w-full h-64 object-cover cursor-pointer"
      />
    </a>
    <div class="px-6 py-4 text-center">
      <p class="text-black text-xl font-semibold">
        {{ product.brand.name }}
      </p>
      <div class="text-lg font-bold">{{ product.name }}</div>
      <p class="text-gray-500 text-sm pb-2">{{ product.concentration }}</p>
      <p class="font-bold text-2xl">{{ formatPrice(product.price) }}</p>
    </div>
  </div>
</template>
