<script setup lang="ts">
const perfumeBrands = [
  'Chanel',
  'Dior',
  'Gucci',
  'Armani',
  'Versace',
  'Burberry',
  'Calvin Klein',
  'Hugo Boss',
  'Yves Saint Laurent',
  'Givenchy'
]
const selectedBrands = [] // Tableau pour stocker les marques sélectionnées
const perfumeCategories = [
  'Floral',
  'Boisé',
  'Aromatique',
  'Fruité',
  'Oriental',
  'Chypré',
  'Agrumes',
  'Aquatique'
]
</script>

<template>
  <div class="flex">
    <div class="w-1/6 bg-sidebar-gray px-4">
      <div class="mt-24">
        <h1 class="text-xl font-bold text-black">Affiner par :</h1>
      </div>
      <div class="h-px bg-gray-200 my-2"></div>
      <div class="my-4">
        <h2 class="text-lg font-semibold mb-3">CATÉGORIE</h2>
        <v-select
          label="Choissisez une catégorie"
          :items="perfumeCategories"
          variant="solo"
          hide-details="auto"
        ></v-select>
      </div>
      <div class="h-px bg-gray-200 my-2"></div>
      <div class="my-4">
        <h2 class="text-lg font-semibold mb-3">MARQUE</h2>
        <v-text-field hide-details="auto" placeholder="Recherche" bg-color="white"></v-text-field>
        <div v-for="(brand, index) in perfumeBrands" :key="index" class="mt-3">
          <input
            type="checkbox"
            :id="'checkbox_' + index"
            :name="'checkbox_' + index"
            v-model="selectedBrands"
            :value="brand"
            class="mr-2"
          />
          <label :for="'checkbox_' + index" class="text-sm">{{ brand }}</label>
        </div>
      </div>
      <div class="h-px bg-gray-200 my-2"></div>
      <div class="my-4">
        <h2 class="text-lg font-semibold">PRIX</h2>
        <input
          type="range"
          id="priceRange"
          name="priceRange"
          min="0"
          max="1000"
          step="10"
          value="500"
          class="w-full mt-2"
        />
        <div class="flex justify-between mt-2">
          <span class="text-xs">0€</span>
          <span class="text-xs">1000€</span>
        </div>
      </div>
      <div class="flex justify-center mb-14">
        <button class="w-full mt-8 bg-[#D8B775] text-white font-bold py-2 rounded text-center">
          APPLIQUER LES FILTRES
        </button>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
