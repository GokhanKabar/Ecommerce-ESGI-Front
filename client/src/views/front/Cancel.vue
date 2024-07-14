<script setup lang="ts">
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <h1 class="text-4xl font-bold mb-4">Paiement annulé</h1>
      <p class="text-lg">Votre paiement n'a pas été traité.</p>
      <router-link to="/" class="mt-4 bg-[#D8B775] text-white px-4 py-2 rounded hover:bg-secondary">
        Retour à l'accueil
      </router-link>
    </div>
  </DefaultLayout>
</template>
