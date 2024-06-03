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
          <p class="text-xs pb-2 mt-4">180,00 €</p>
          <p class="text-xs text-gray-500 mt-4">
            PANNACO TAHAA de FOMOWA PARIS est une épopée olfactive qui nous transporte à travers des
            paysages exotiques et des cultures richement aromatiques. L'aventure commence au cœur
            vibrant de la Thaïlande, où le fruit succulent de la mangue Mahachanok se dévoile dans
            les marchés animés de Bangkok, offrant une promesse de douceur qui capte l'essence
            colorée de la région.
          </p>
          <div class="mt-8 flex items-center justify-center space-x-4">
            <input
              type="number"
              min="1"
              value="1"
              class="border border-gray-300 p-2 w-16 text-center"
            />
            <button class="bg-black text-white px-4 py-2 w-50">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </sidebarProduct>
  </DefaultLayout>
</template>
