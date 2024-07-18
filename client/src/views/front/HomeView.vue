<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import CarousselPerfume from '../../components/front/Product/CarousselPerfume.vue'
import ProductService from '../../services/ProductService'
import { type Product } from '../../types/products.types'
import getImagePath from '../../utils/getImagePath'
import { useRouter } from 'vue-router'

const router = useRouter()
const lastProduct = ref<Product | null>(null)

onMounted(async () => {
  try {
    const product = await ProductService.getLastProduct('homme')
    lastProduct.value = product
  } catch (error) {
    console.error('Failed to fetch last product:', error)
  }
})

const goToProductPage = () => {
  if (lastProduct.value) {
    router.push(`/product/${lastProduct.value._id}`)
  }
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
          <button
            class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            @click="goToProductPage"
          >
            Découvrir
          </button>
        </div>
        <div class="text-center">
          <img
            :src="getImagePath(lastProduct?.image)"
            alt="Product"
            class="w-80 h-auto mb-4 cursor-pointer"
            @click="goToProductPage"
          />
          <p class="text-xl text-gray-500">{{ lastProduct?.brand.name ?? 'Unknown' }}</p>
          <p class="text-2xl font-bold">{{ lastProduct?.name }}</p>
          <p class="text-sm font-semibold">{{ lastProduct?.price }} €</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center py-12 bg-gray-100">
      <div class="max-w-3xl text-center">
        <h1 class="text-4xl font-bold mb-4">Qui sommes-nous</h1>
        <p class="text-lg leading-relaxed">
          Nous sommes une entreprise dédiée à la création de parfums uniques et exclusifs. Notre
          mission est de capturer les émotions et les souvenirs dans chaque flacon. Nous croyons en
          l'importance de la qualité et de l'authenticité, et nous nous engageons à fournir les
          meilleurs produits à nos clients.
        </p>
        <p class="text-lg leading-relaxed mt-4">
          Fondée en 2023, notre entreprise a su se démarquer par son innovation et son dévouement à
          l'excellence. Rejoignez-nous dans notre voyage pour découvrir des senteurs qui vous
          transporteront dans des mondes merveilleux.
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>
