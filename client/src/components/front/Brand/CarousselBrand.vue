<script setup lang="ts">
import caroussel from '../../../assets/carou1.png'
import caroussel2 from '../../../assets/carou2.jpeg'
import carouseel3 from '../../../assets/carou3.jpeg'

const slides = [caroussel, caroussel2, carouseel3]
</script>

<template>
  <div class="w-full mx-auto ">
    <v-carousel height="400" show-arrows="true" cycle>
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <img :src="slide" alt="Slide" class="w-full h-full object-cover" />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>