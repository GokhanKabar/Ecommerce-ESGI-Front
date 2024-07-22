<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import SidebarProduct from '../../components/front/Product/SidebarProduct.vue'
import CardPerfume from '../../components/front/Product/CardPerfume.vue'
import CarousselPerfume from '../../components/front/Product/CarousselPerfume.vue'
import ProductService from '../../services/ProductService'
import { type Product } from '../../types/products.types'
import { type Ref } from 'vue'

const allProducts: Ref<Product[]> = ref([])
const filteredProducts: Ref<Product[]> = ref([])
const route = useRoute()
const router = useRouter()

const fetchProducts = async (filters = {}) => {
  allProducts.value = await ProductService.getProductsByCategory('homme', filters)
  applyFilters(filters)
}

const applyFilters = (filters: {
  brands: string[]
  families: string[]
  priceRange: [number, number]
  promotion: boolean
  stock: boolean
}) => {
  filteredProducts.value = allProducts.value.filter((product) => {
    const matchesBrand = filters.brands.length ? filters.brands.includes(product.brand.name) : true
    const matchesFamily = filters.families.length
      ? filters.families.includes(product.family.name)
      : true
    const matchesPrice =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    const matchesPromotion = !filters.promotion || (filters.promotion && product.promotion > 0)
    const matchesStock = !filters.stock || (filters.stock && product.stock > 0)
    return matchesBrand && matchesFamily && matchesPrice && matchesPromotion && matchesStock
  })
}

const loadFiltersFromQuery = () => {
  return {
    brands: route.query.brands ? route.query.brands.split(',') : [],
    families: route.query.families ? route.query.families.split(',') : [],
    priceRange: [
      route.query.minPrice ? Number(route.query.minPrice) : 0,
      route.query.maxPrice ? Number(route.query.maxPrice) : 1000
    ] as [number, number],
    promotion: route.query.promotion === 'true',
    stock: route.query.stock === 'true'
  }
}

onMounted(() => {
  const filters = loadFiltersFromQuery()
  fetchProducts(filters)
})

watch(route, () => {
  const filters = loadFiltersFromQuery()
  applyFilters(filters)
})
</script>

<template>
  <DefaultLayout>
    <CarousselPerfume />
    <div class="flex">
      <SidebarProduct category="homme" @apply-filters="applyFilters" />
      <div class="w-5/6 p-4">
        <div class="text-center text-black text-3xl p-12">
          <h1>NOS PRODUITS PARFUM HOMME</h1>
        </div>
        <CardPerfume :products="filteredProducts" />
      </div>
    </div>
  </DefaultLayout>
</template>
