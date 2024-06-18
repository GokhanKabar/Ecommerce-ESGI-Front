<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
import CarousselPerfume from '@/components/front/Product/CarousselPerfume.vue'
import ProductService from '@/services/ProductService'
import BrandService from '@/services/BrandService'
import { type Product } from '@/types/products.types'
import { type Brand } from '@/types/brands.types'
import getImagePath from '@/utils/getImagePath'

const lastProduct = ref<Product | null>(null)
const brands = ref<Brand[]>([])

onMounted(async () => {
  try {
    const product = await ProductService.getLastProduct('homme')
    lastProduct.value = product
    brands.value = await BrandService.getAllBrands()
  } catch (error) {
    console.error('Failed to fetch last product or brands:', error)
  }
})

const getBrandName = (brandId: string) => {
  const brand = brands.value.find((b) => b._id === brandId)
  return brand ? brand.name : 'Unknown'
}
</script>

<template>
  <DefaultLayout>
    <CarousselPerfume />
    <div class="flex flex-col items-center justify-center py-12">
      <div class="flex justify-between items-center w-3/5 space-x-8">
        <div class="max-w-lg text-center">
          <h1 class="text-4xl font-bold mb-4">EN CE MOMENT</h1>
          <h2 class="text-2xl font-bold mb-4">{{ lastProduct?.name ?? 'Loading...' }}</h2>
          <p class="text-lg">{{ lastProduct?.description ?? '' }}</p>
        </div>
        <div class="text-center">
          <img :src="getImagePath(lastProduct?.image)" alt="Product" class="w-80 h-auto mb-4" />
          <p class="text-xl text-gray-500">{{ getBrandName(lastProduct?.brandId) }}</p>
          <p class="text-2xl font-bold">{{ lastProduct?.name }}</p>
          <p class="text-sm font-semibold">{{ lastProduct?.price }} €</p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
