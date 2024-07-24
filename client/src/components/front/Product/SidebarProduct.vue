<script setup lang="ts">
import { ref, onMounted, defineEmits, computed, watch } from 'vue'
import ProductService from '../../../services/ProductService.js'
import { type Product } from '../../../types/products.types'
import { type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { defineProps } from 'vue'

const props = defineProps<{ category: string }>()
const products: Ref<Product[]> = ref([])
const selectedBrands: Ref<string[]> = ref([])
const selectedFamilies: Ref<string[]> = ref([])

const priceRange = ref<[number, number]>([0, 1000])
const promotionFilter = ref(false)
const stockFilter = ref(false)

const router = useRouter()
const route = useRoute()

const loadFiltersFromQuery = () => {
  selectedBrands.value = route.query.brands ? route.query.brands.split(',') : []
  selectedFamilies.value = route.query.families ? route.query.families.split(',') : []
  priceRange.value = [
    route.query.minPrice ? Number(route.query.minPrice) : 0,
    route.query.maxPrice ? Number(route.query.maxPrice) : 1000
  ]
  promotionFilter.value = route.query.promotion === 'true'
  stockFilter.value = route.query.stock === 'true'
}

onMounted(async () => {
  await fetchProducts()
  loadFiltersFromQuery()
})

const fetchProducts = async () => {
  try {
    const response = await ProductService.getProductsByCategory(props.category)
    if (response) {
      products.value = response
    }
  } catch (error) {
    console.error('Failed to fetch products', error)
  }
}

const emit = defineEmits(['apply-filters'])

const updateUrlWithFilters = () => {
  const query: Record<string, string> = {}
  if (selectedBrands.value.length) query.brands = selectedBrands.value.join(',')
  if (selectedFamilies.value.length) query.families = selectedFamilies.value.join(',')
  if (priceRange.value[0] !== 0) query.minPrice = priceRange.value[0].toString()
  if (priceRange.value[1] !== 1000) query.maxPrice = priceRange.value[1].toString()
  if (promotionFilter.value) query.promotion = promotionFilter.value.toString()
  if (stockFilter.value) query.stock = stockFilter.value.toString()
  router.push({ query })
  applyFilters()
}

const applyFilters = () => {
  emit('apply-filters', {
    brands: selectedBrands.value,
    families: selectedFamilies.value,
    priceRange: priceRange.value,
    promotion: promotionFilter.value,
    stock: stockFilter.value
  })
}

watch(
  [selectedBrands, selectedFamilies, priceRange, promotionFilter, stockFilter],
  updateUrlWithFilters
)

// Extract unique brands and families from products
const brands = computed(() => {
  if (products.value.length > 0) {
    return [...new Set(products.value.map((product) => product.brand.name))]
  }
  return []
})

const families = computed(() => {
  if (products.value.length > 0) {
    return [...new Set(products.value.map((product) => product.family.name))]
  }
  return []
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
