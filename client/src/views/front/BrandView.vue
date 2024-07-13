<script setup lang="ts">
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue';
import CarousselBrand from '../../components/front/Brand/CarousselBrand.vue';
import { computed, onMounted, ref } from 'vue';
import BrandService from '@/services/BrandService';

const brands = ref<string[]>([]);
onMounted(async () => {
  try {
    const fetchedBrands = await BrandService.getAllBrands();
    const brandsArray = fetchedBrands || []; 
    brands.value = brandsArray.map((brand: any) => brand.name);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
});

const groupedBrands = computed(() => {
  const groups: { [key: string]: string[] } = {};
  brands.value.forEach(brand => {
    const firstLetter = brand[0].toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(brand);
  });
  return groups;
});
</script>

<template>
  <DefaultLayout>
    <CarousselBrand />
    <div class="mt-6">
      <h1 class="text-4xl mb-4 text-center italic">Parfums vous propose les marques</h1>
      <div class="flex flex-col justify-center items-center">
        <hr class="w-40 h-1 bg-[#D8B775] border-none mb-2">
        <p class="text-center italic w-100 mb-8">
          Contactez notre service client par téléphone et demandez directement la conseillère dédiée.
          <br> 04.92.52.86.18 du lundi au vendredi de 9h00 à 12h00 et de 14h à 17h.
        </p>
      </div>
      <div>
        <ul class="flex flex-row justify-center flex-wrap">
          <li v-for="(brands, letter) in groupedBrands" :key="letter" class="m-5">
            <div>
              <h3 class="text-xl font-bold mb-2 bg-[#D8B775] w-45 py-1 px-4 text-white">{{ letter }}</h3>
              <ul class="pl-4">
                <li v-for="brand in brands" :key="brand" class="ml-0 font-medium hover:text-[#D8B775]">{{ brand }}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </DefaultLayout>
</template>
