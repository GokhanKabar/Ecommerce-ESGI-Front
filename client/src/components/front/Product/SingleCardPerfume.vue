<script setup lang="ts">
import { type Product } from '@/types/products.types'

interface Props {
  product: Product
  getBrandName: (brandId: string) => string
}

const props = defineProps<Props>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

<template>
  <div class="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
    <a :href="`/product/${props.product.id}`">
      <img
        :src="props.product.image"
        :alt="props.product.name"
        class="w-full h-64 object-cover cursor-pointer"
      />
    </a>
    <div class="px-6 py-4 text-center">
      <p class="text-black text-xl font-semibold">
        {{ props.getBrandName(props.product.brandId) }}
      </p>
      <div class="text-lg">{{ props.product.name }}</div>
      <p class="text-gray-500 text-sm pb-2">{{ props.product.concentration }}</p>
      <p class="font-bold text-2xl">{{ formatPrice(props.product.price) }}</p>
    </div>
  </div>
</template>
