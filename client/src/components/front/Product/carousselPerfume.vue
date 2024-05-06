<script setup lang="ts">
import caroussel from '../../../assets/caroussel.jpeg'

const slides = [caroussel, caroussel, caroussel, caroussel, caroussel]
</script>

<template>
  <div class="w-2/4 mx-auto">
    <v-carousel height="400" show-arrows="true" cycle>
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <img :src="slide" alt="Slide Image" style="width: 100%; height: 100%" />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>
