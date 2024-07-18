<script setup lang="ts">
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="py-10 px-5 md:px-10 lg:px-20 bg-gray-100">
      <h1 class="text-3xl font-bold text-center mb-8">Paiement sécurisé</h1>
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p class="text-xl font-semibold mb-4">Paiement sécurisé</p>
        <p class="text-lg mb-4">
          Nous accordons une grande importance à la sécurité de vos données bancaires.
        </p>
        <p class="text-lg mb-4">
          Nous utilisons la technologie 🔐 SSL (Secure Socket Layer) pour vous garantir la pleine
          sécurité des transactions effectuées sur notre site. Cela nous permet de crypter vos
          données personnelles afin qu’elles soient illisibles.
        </p>
        <p class="text-xl font-semibold mb-4">Avec Visa/Mastercard</p>
        <p class="text-lg mb-4">
          Aussi, nous avons mis en place l’authentification par 3-D Secure. Elle permet de vérifier
          votre identité lors de vos achats en ligne par carte bancaire.
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>
