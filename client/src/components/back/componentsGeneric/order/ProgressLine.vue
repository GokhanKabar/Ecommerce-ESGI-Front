
<script setup lang="ts">
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import caroussel from '../../../../assets/dior.png'
import caroussel2 from '../../../../assets/dior.png'
import carouseel3 from '../../../../assets/dior.png'

const slides = [caroussel, caroussel2, carouseel3]
</script>

<template>
    <div class="border p-4 m-8 rounded shadow w-4/5 mx-auto list-none" data-address="">
      <div class="flex justify-between items-center p-4 rounded bg-slate-200">
        <span class="text-gray-600"> order.date </span>
        <span class="font-semibold">Numéro de commande  order.number </span>
      </div>
      <div class="flex justify-between border p-4 rounded bg-slate-100">
        <div class="flex  items-center mb-2">
          <div class="mr-2">
            <svg class="w-6 h-6 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.1265 9.17158L10.409 15.8891L6.87347 12.3536L7.58058 11.6465L10.409 14.4745L16.4194 8.46448L17.1265 9.17158Z" fill="currentColor"></path>
            </svg>
          </div>
          <div >
            <div class="font-semibold">Signé</div>
            <div class="text-sm text-gray-600"> order.signedDate </div>
          </div>
        </div>
        <div >
            <div class="font-semibold">Total : <span> 90 </span> € </div>
            <div class="text-sm text-gray-600"> Payé </div>
          </div>
      </div>
        <div class="grid grid-cols-4 gap-4 items-center">
            <!-- Carousel section -->
            <div class="col-span-2">
                <div class="w-full mx-8">
                    <v-carousel height="200" hide-delimiters>
                        <v-carousel-item v-for="(slide, i) in slides" :key="i">
                            <img :src="slide" alt="Slide" class="w-full h-full object-cover" />
                        </v-carousel-item>
                    </v-carousel>
                </div>
                <div  class="flex justify-center mx-20 text-lg"> 3 articles</div>
            </div>

            <!-- Buttons section -->
            <div class="col-span-2 flex flex-col space-y-2 m-12">
              
                <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded">Suivre</button>
                <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded">Renvoyer l'article</button>
                <ButtonDefault @click="" label="Paiement" customClasses="bg-[#D8B775] text-white rounded-md">
                </ButtonDefault>
            </div>
        </div>

       
    </div>
  </template>