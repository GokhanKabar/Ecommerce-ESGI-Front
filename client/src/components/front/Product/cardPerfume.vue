<script setup lang="ts">
import { defineProps } from 'vue'
import { type Product } from '@/types/products.types'
import getImagePath from '@/utils/getImagePath'

interface Props {
  products: Product[]
}

const props = defineProps<Props>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function calculateDiscountedPrice(price: number, promotion: number): string {
  const discountedPrice = price - (price * promotion) / 100
  return formatPrice(discountedPrice)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="(perfume, index) in props.products"
      :key="index"
      class="max-w-xs rounded overflow-hidden shadow-lg"
    >
      <a :href="`/product/${perfume._id}`">
        <img :src="getImagePath(perfume.image)" :alt="perfume.name" class="w-full cursor-pointer" />
      </a>
      <div class="px-4 py-2 text-center">
        <p class="text-gray-500 text-lg">{{ perfume.brand.name }}</p>
        <div class="text-xl font-bold">{{ perfume.name }}</div>
        <p class="text-gray-500 text-xs pb-2">{{ perfume.concentration }}</p>
        <div>
          <p v-if="perfume.promotion > 0" class="font-bold text-xl text-[#d8b775]">
            {{ calculateDiscountedPrice(perfume.price, perfume.promotion) }}
          </p>
          <p v-if="perfume.promotion > 0" class="line-through text-gray-500">
            {{ formatPrice(perfume.price) }}
          </p>
          <p v-else class="text-xl">{{ formatPrice(perfume.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
