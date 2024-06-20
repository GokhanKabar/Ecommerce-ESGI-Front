<script setup lang="ts">
import { ref, onMounted, defineEmits, computed } from 'vue'
import ProductService from '@/services/ProductService.js'
import { type Product } from '@/types/products.types'
import { type Ref } from 'vue'

const products: Ref<Product[]> = ref([])
const selectedBrands: Ref<string[]> = ref([])
const selectedFamilies: Ref<string[]> = ref([])

const priceRange = ref<[number, number]>([0, 1000])
const promotionFilter = ref(false)
const stockFilter = ref(false)

onMounted(async () => {
  products.value = await ProductService.getAllProducts()
})

const emit = defineEmits(['apply-filters'])

const applyFilters = () => {
  emit('apply-filters', {
    brands: selectedBrands.value,
    families: selectedFamilies.value,
    priceRange: priceRange.value,
    promotion: promotionFilter.value,
    stock: stockFilter.value
  })
}

// Extract unique brands and families from products
const brands = computed(() => {
  return [...new Set(products.value.map((product) => product.brand.name))]
})

const families = computed(() => {
  return [...new Set(products.value.map((product) => product.family.name))]
})
</script>

<template>
  <div class="w-1/6 bg-gray-100 px-4 py-6">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-black">Affiner par :</h1>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">Famille</h2>
      <div class="max-h-44 overflow-y-scroll scrollbar-visible">
        <div v-for="(family, index) in families" :key="index" class="flex items-center mt-3">
          <input
            type="checkbox"
            :id="'family_' + index"
            :name="'family_' + index"
            v-model="selectedFamilies"
            :value="family"
            class="mr-2 checkbox"
          />
          <label :for="'family_' + index" class="text-sm">{{ family }}</label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">MARQUE</h2>
      <div class="max-h-44 overflow-y-scroll scrollbar-visible">
        <div v-for="(brand, index) in brands" :key="index" class="flex items-center mt-3">
          <input
            type="checkbox"
            :id="'brand_' + index"
            :name="'brand_' + index"
            v-model="selectedBrands"
            :value="brand"
            class="mr-2 checkbox"
          />
          <label :for="'brand_' + index" class="text-sm">{{ brand }}</label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold">PRIX</h2>
      <v-range-slider
        v-model="priceRange"
        :min="0"
        :max="1000"
        :step="10"
        range
        class="mt-2"
      ></v-range-slider>
      <div class="flex justify-between mt-2 text-xs">
        <span>{{ priceRange[0] }}€</span>
        <span>{{ priceRange[1] }}€</span>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">Promotion</h2>
      <div class="flex items-center">
        <input
          type="checkbox"
          id="promotionFilter"
          v-model="promotionFilter"
          class="mr-2 checkbox"
        />
        <label for="promotionFilter" class="text-sm">En Promotion</label>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">Stock</h2>
      <div class="flex items-center">
        <input type="checkbox" id="stockFilter" v-model="stockFilter" class="mr-2 checkbox" />
        <label for="stockFilter" class="text-sm">En Stock</label>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        @click="applyFilters"
        class="w-full mt-4 bg-[#D8B775] text-white font-bold py-2 rounded text-center apply-button"
      >
        APPLIQUER LES FILTRES
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-visible::-webkit-scrollbar {
  width: 12px;
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: #d8b775;
  border-radius: 6px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Styles for checkboxes */
.checkbox:checked {
  accent-color: #d8b775; /* For browsers supporting accent-color */
}

.checkbox:checked + label::before {
  background-color: #d8b775; /* For custom styled checkboxes */
}

/* Styles for apply button */
.apply-button:active {
  background-color: #b59461;
}
</style>
