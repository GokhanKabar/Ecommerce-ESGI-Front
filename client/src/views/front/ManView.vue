<script setup lang="ts">
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import sidebarProduct from '../../components/front/Product/sidebarProduct.vue'
import cardPerfume from '../../components/front/Product/cardPerfume.vue'
import carousselPerfume from '../../components/front/Product/carousselPerfume.vue'
</script>

<template>
  <DefaultLayout>
    <carousselPerfume />
    <sidebarProduct>
      <div class="w-5/6 p-4">
        <div class="text-center text-black text-3xl p-12">
          <h1>NOS PRODUITS PARFUM HOMME</h1>
        </div>
        <cardPerfume />
      </div>
    </sidebarProduct>
  </DefaultLayout>
</template>
