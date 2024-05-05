<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import DropdownUser from './DropdownUser.vue'
import DropdownNotification from './DropdownNotification.vue'
// Importez les dépendances nécessaires ici
const props = defineProps({
  showSidebar: Boolean,
  getShowSidebar: Function ,
});
</script>

<template>
    <header class="bg-white shadow w-full h-16">
        <div class="flex flex-row items-center justify-between">

            <div class=" py-2.5">
                <button @click="getShowSidebar" class="text-[#C58940] font-extrabold  lg:hidden md:inline-block">
                    <svg v-if="showSidebar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                    </svg>
                </button>

            </div>
            <div class="flex flex-row gap-5 items-center mr-10 lg:mt-2 ">
            <DropdownNotification/>
              <DropdownUser/>

            </div>
        </div>
    </header>
</template>
 