<script setup lang="ts">
import { ref } from 'vue'
import dior from '../../../assets/dior.png'
const perfumes = ref([
  {
    id: 1,
    brand: 'Dior',
    name: 'Sauvage',
    type: 'Eau de Toilette',
    price: '120.00 €',
    image: dior
  },
  {
    id: 2,
    brand: 'Dior',
    name: 'Sauvage',
    price: '120.00 €',
    type: 'Eau de Toilette',
    image: dior
  },
  {
    id: 3,
    brand: 'Dior',
    name: 'Sauvage',
    price: '120.00 €',
    type: 'Eau de Toilette',
    image: dior
  },
  {
    id: 4,
    brand: 'Dior',
    name: 'Sauvage',
    price: '120.00 €',
    type: 'Eau de Toilette',
    image: dior
  },
  {
    id: 5,
    brand: 'Dior',
    name: 'Sauvage',
    price: '120.00 €',
    type: 'Eau de Toilette',
    image: dior
  }
])
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div v-for="(perfume, index) in perfumes" :key="index" class="max-w-xs rounded overflow-hidden">
      <a :href="`/product/${perfume.id}`">
        <!-- Lien autour de l'image uniquement -->
        <img :src="perfume.image" :alt="perfume.name" class="w-full cursor-pointer" />
      </a>
      <div class="px-4 py-2 text-center">
        <p class="text-black text-lg">{{ perfume.brand }}</p>
        <div class="text-lg">{{ perfume.name }}</div>
        <p class="text-gray-500 text-xs pb-2">{{ perfume.type }}</p>
        <p class="font-bold text-xl">{{ perfume.price }}</p>
      </div>
    </div>
  </div>
</template>
