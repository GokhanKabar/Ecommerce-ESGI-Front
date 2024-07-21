<script setup lang="ts">
import { defineProps } from 'vue'
import { type Product } from '../../../../types/products.types'
import getImagePath from '../../../../utils/getImagePath'
import ButtonDefault from '../Buttons/ButtonDefault.vue';
import store from '../../../../store/store.js';


const props = defineProps<{
    products: Product[];
}>();


function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function calculateDiscountedPrice(price: number, promotion: number): string {
  const discountedPrice = price - (price * promotion) / 100
  return formatPrice(discountedPrice)
}


function addtocart(product){
  store.dispatch('addProductToCart', {
        id: product.sequelizeId,
        name: product.name,
        price: product.promotion
          ? calculateDiscountedPrice(product.price, product.promotion)
          : product.price,
        promo: product.promotion,
        image: product.image,
        stock: product.stock,
        quantity: 1,
      });
}


</script>

<template>


  <div class="w-2/5 m-4 px-14">
    <div class="text-center text-red font-bold text-3xl py-6">
      <h1>
        NOS BIG PROMOS
      </h1> 
    </div>
    <div
      v-for="(perfume) in props.products"
      :key="perfume.sequelizeId"
      class=" h-fit rounded overflow-hidden shadow-lg m-2"
    >
      <a href="">
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
          <p v-if="perfume.promotion > 0" class="line-through text-red">
            {{ formatPrice(perfume.price) }}
          </p>
          <p v-else class="text-xl">{{ formatPrice(perfume.price) }}</p>
          <ButtonDefault @click="addtocart(perfume)" label="Ajouter au panier" customClasses="bg-[#D8B775] text-white rounded-md">
          </ButtonDefault>
        </div>
      </div>
    </div>
  </div>
</template>
