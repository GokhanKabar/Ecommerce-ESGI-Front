<script setup lang="ts">
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import sidebarProduct from '../../components/front/Product/sidebarProduct.vue'
import dior from '../../assets/dior.png'
</script>

<template>
  <DefaultLayout>
    <sidebarProduct>
      <div class="w-5/6 p-12 flex">
        <!-- Division de l'image à gauche -->
        <div class="w-2/6">
          <img :src="dior" alt="Dior" class="w-full" />
        </div>
        <!-- Division du texte à droite -->
        <div class="w-4/6 p-4">
          <h1 class="text-3xl font-bold">DIOR</h1>
          <h2 class="text-xl font-semibold">SAUVAGE</h2>
        </div>
      </div>
    </sidebarProduct>
  </DefaultLayout>
</template>
