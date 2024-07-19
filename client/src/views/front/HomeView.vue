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
  const cookieConsent = localStorage.getItem('cookieConsent')
  const isCookiePopupVisible = ref(!cookieConsent) 

onMounted(async () => {
  try {
    const product = await ProductService.getLastProduct('homme')
    lastProduct.value = product
  } catch (error) {
    console.error('Failed to fetch last product:', error)
  }

  const cookieConsent = localStorage.getItem('cookieConsent')
  if (cookieConsent === 'accepted' || cookieConsent === 'refused') {
    isCookiePopupVisible.value = false
  }
})

const goToProductPage = () => {
  if (lastProduct.value) {
    router.push(`/product/${lastProduct.value._id}`)
  }
}

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted')
  isCookiePopupVisible.value = false
}

const refuseCookies = () => {
  localStorage.setItem('cookieConsent', 'refused')
  isCookiePopupVisible.value = false
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
          <button class="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800" @click="goToProductPage">
            Découvrir
          </button>
        </div>
        <div class="text-center">
          <img :src="getImagePath(lastProduct?.image)" alt="Product" class="w-80 h-auto mb-4 cursor-pointer"
            @click="goToProductPage" />
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
    <div v-if="isCookiePopupVisible" class="overlay">
      <section class="fixed top-59 left-1/2 transform -translate-x-1/2 w-[45%] p-4 mx-auto bg-white border border-gray-200 rounded-2xl">
        <h2 class="font-semibold text-gray-800">🍪 Avis sur les cookies</h2>

        <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">Notre boutique en ligne PARFUMS et ses partenaires
          peuvent procéder au dépôt de cookies et traceurs dans le but de garantir une expérience de navigation optimale.
          Ils permettent également d’améliorer votre expérience utilisateur, d’obtenir des statistiques ciblées, et de
          mieux orienter nos opérations promotionnelles et commerciales en lien avec vos habitudes et centres d’intérêts.
          Avec votre accord, des données pseudonymisées pourront être envoyées à des tiers tels que Google ou Meta, afin
          qu’ils puissent nous offrir des services de mesure de performance de nos annonces publicitaires.
          Vous pouvez librement choisir d’accepter, de personnaliser ou de refuser ces outils de suivi et d’optimisations
          promotionnelles, commerciales et analyses statistiques. <router-link to=""
            class="!text-primary hover:underline"> Lire les politiques de cookies</router-link>. </p>

        <div class="flex items-center justify-between mt-4 gap-x-4 shrink-0">
          <button
            class="text-xs text-red underline transition-colors duration-300  hover:text-gray-600 focus:outline-none"
            @click="refuseCookies">
            Refuser
          </button>

          <button
            class="text-xs !bg-primary font-medium rounded-lg hover:bg-orange-300 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
            @click="acceptCookies">
            Accepter
          </button>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  pointer-events: auto; 
  z-index: 40;
}
</style>
