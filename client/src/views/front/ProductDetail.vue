<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getProductById,
  getBrandById,
  getFamilyById,
  getProductsByFamilyId
} from '../../api/products'
import { type Product } from '../../types/products.types'
import { type Brand } from '../../types/brands.types'
import { type Family } from '../../types/families.types'
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
import SingleCardPerfume from '@/components/front/Product/SingleCardPerfume.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

const product = ref<Product | null>(null)
const brand = ref<Brand | null>(null)
const family = ref<Family | null>(null)
const relatedProducts = ref<Product[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const productData = await getProductById(productId)
    product.value = productData
    if (productData) {
      brand.value = await getBrandById(productData.brandId)
      family.value = await getFamilyById(productData.familyId)
      relatedProducts.value = await getProductsByFamilyId(productData.familyId, 4)
    }
    isLoading.value = false
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement du produit'
    isLoading.value = false
  }
})

function getBrandName(brandId: string): string {
  return brand?.value?.id === brandId ? brand.value.name : 'Unknown'
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function goBack() {
  router.back()
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto py-4">
      <nav class="text-sm text-gray-500 mb-4">
        <router-link to="/homme" class="text-[#d8b775] font-bold hover:underline">
          Parfum Homme
        </router-link>
        <span class="text-black"> / </span>
        <span class="text-black"
          >{{ brand?.name || 'Marque inconnue' }} {{ product?.name || 'Nom du parfum' }}</span
        >
      </nav>
    </div>
    <div v-if="isLoading" class="text-center py-8">Chargement...</div>
    <div v-else-if="errorMessage" class="text-center py-8 text-red-500">{{ errorMessage }}</div>
    <div v-else-if="product" class="container mx-auto py-12">
      <div class="flex flex-wrap -mx-4">
        <!-- Division de l'image à gauche -->
        <div class="w-full md:w-1/2 px-4">
          <img :src="product.image" :alt="product.name" class="w-full object-cover h-auto" />
        </div>
        <!-- Division du texte à droite -->
        <div class="w-full md:w-1/2 px-4">
          <h1 class="text-3xl font-bold">{{ brand?.name || 'Marque inconnue' }}</h1>
          <h2 class="text-xl font-semibold">{{ product.name }}</h2>
          <p class="text-lg mt-4">{{ formatPrice(product.price) }}</p>
          <p class="text-gray-500 mt-4">{{ product.description }}</p>
          <div class="flex items-center mt-4">
            <p class="text-l font-bold mr-2">Famille :</p>
            <p class="text-l">{{ family?.name || 'Famille inconnue' }}</p>
          </div>
          <div class="flex items-center mt-4">
            <p class="text-l font-bold mr-2">Concentration :</p>
            <p class="text-l">{{ product.concentration }}</p>
          </div>
          <div class="mt-8 flex items-center space-x-4">
            <input
              type="number"
              min="1"
              value="1"
              class="border border-gray-300 p-2 w-16 text-center"
            />
            <button class="bg-[#d8b775] text-white px-4 py-2 w-50 hover:bg-[#b59461]">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      <!-- Section pour afficher les produits de la même famille -->
      <div class="mt-12 flex flex-col items-center">
        <h2 class="text-2xl font-bold mb-4">Cette sélection devrait vous plaire</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SingleCardPerfume
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
            :getBrandName="getBrandName"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
