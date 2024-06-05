<script setup lang="ts">
import { defineProps } from 'vue'
import { type Product } from '../../../types/products.types'

const props = defineProps<{
  products: Product[]
  getBrandName: (brandId: string) => string
}>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="(perfume, index) in props.products"
      :key="index"
      class="max-w-xs rounded overflow-hidden shadow-lg"
    >
      <a v-if="perfume.image" :href="`/product/${perfume.id}`">
        <img :src="perfume.image" :alt="perfume.name" class="w-full cursor-pointer" />
      </a>
      <div class="px-4 py-2 text-center">
        <p class="text-black text-lg">{{ props.getBrandName(perfume.brandId) }}</p>
        <div class="text-lg">{{ perfume.name }}</div>
        <p class="text-gray-500 text-xs pb-2">{{ perfume.concentration }}</p>
        <p class="font-bold text-xl">{{ formatPrice(perfume.price) }}</p>
      </div>
    </div>
  </div>
</template>
