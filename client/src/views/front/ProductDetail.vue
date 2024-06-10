<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductService from '../../services/ProductService'
import BrandService from '../../services/BrandService'
import FamilyService from '../../services/FamilyService'
import { type Product } from '../../types/products.types'
import { type Brand } from '../../types/brands.types'
import { type Family } from '../../types/families.types'
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
import SingleCardPerfume from '@/components/front/Product/SingleCardPerfume.vue'
import getImagePath from '@/utils/getImagePath'

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
    const productData = await ProductService.getProductById(productId)
    product.value = productData
    if (productData) {
      const getBrand = await BrandService.getBrandById(productData.brandId)
      brand.value = getBrand.data
      console.log(brand.value)
      const getFamily = await FamilyService.getFamilyById(productData.familyId)
      family.value = getFamily.data
      const allRelatedProducts = await ProductService.getProductsByFamilyId(productData.familyId, 5)
      // Filtre pour exclure le produit actuellement affiché
      relatedProducts.value = allRelatedProducts.filter((p: Product) => p._id !== productData._id)
    }
    isLoading.value = false
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement du produit'
    isLoading.value = false
  }
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function calculateDiscountedPrice(price: number, promotion: number): string {
  const discountedPrice = price - (price * promotion) / 100
  return formatPrice(discountedPrice)
}

function goBack() {
  router.back()
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto py-4">
      <nav class="text-sm text-gray-500 mb-4">
        <router-link
          :to="product?.category === 'homme' ? '/homme' : '/femme'"
          class="text-[#d8b775] font-bold hover:underline"
        >
          {{ product?.category === 'homme' ? 'Parfum Homme' : 'Parfum Femme' }}
        </router-link>
        <span class="text-black"> / </span>
        <span class="text-black">
          {{ brand?.name || 'Marque inconnue' }} {{ product?.name || 'Nom du parfum' }}
        </span>
      </nav>
    </div>
    <div v-if="isLoading" class="text-center py-8">Chargement...</div>
    <div v-else-if="errorMessage" class="text-center py-8 text-red-500">{{ errorMessage }}</div>
    <div v-else-if="product" class="container mx-auto py-12">
      <div class="flex flex-wrap -mx-4">
        <!-- Division de l'image à gauche -->
        <div class="w-full md:w-1/2 px-4">
          <img
            :src="getImagePath(product.image)"
            :alt="product.name"
            class="w-full object-cover h-auto"
          />
        </div>
        <!-- Division du texte à droite -->
        <div class="w-full md:w-1/2 px-4">
          <h1 class="text-3xl font-bold">{{ brand?.name || 'Marque inconnue' }}</h1>
          <h2 class="text-xl font-semibold">{{ product.name }}</h2>
          <div class="mt-4">
            <p v-if="product.promotion > 0" class="font-bold text-xl text-[#d8b775]">
              {{ calculateDiscountedPrice(product.price, product.promotion) }}
            </p>
            <p v-if="product.promotion > 0" class="line-through text-gray-500">
              {{ formatPrice(product.price) }}
            </p>
            <p v-else class="text-lg mt-4">{{ formatPrice(product.price) }}</p>
          </div>
          <p class="text-gray-500 mt-4">{{ product.description }}</p>
          <div class="flex items-center mt-4">
            <p class="text-l font-bold mr-2">Famille :</p>
            <p class="text-l">{{ family?.name || 'Famille inconnue' }}</p>
          </div>
          <div class="flex items-center mt-4">
            <p class="text-l font-bold mr-2">Concentration :</p>
            <p class="text-l">{{ product.concentration }}</p>
          </div>
          <div v-if="product.stock <= 5 && product.stock > 0" class="mt-4 text-red-500">
            Il ne reste que {{ product.stock }} parfums en stock !
          </div>
          <div v-else-if="product.stock === 0" class="mt-4 text-red-500">
            Ce produit est en rupture de stock.
          </div>
          <div class="mt-8 flex items-center space-x-4">
            <input
              type="number"
              min="1"
              value="1"
              class="border border-gray-300 p-2 w-16 text-center"
              :disabled="product.stock === 0"
            />
            <button
              class="bg-[#d8b775] text-white px-4 py-2 w-50 hover:bg-[#b59461] disabled:bg-gray-300 disabled:cursor-not-allowed"
              :disabled="product.stock === 0"
            >
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
            :key="relatedProduct._id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
