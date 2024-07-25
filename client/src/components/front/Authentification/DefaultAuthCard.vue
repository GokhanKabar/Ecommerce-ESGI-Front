<script setup lang="ts">
import Icons from '../icons/Icons.vue';
const props = defineProps(['subtitle', 'title', 'customClasses'])
</script>

<template>
  <!-- ====== Forms Section Start -->
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark my-20 mx-10"
  >
    <div class="flex flex-wrap items-center">
      <div class="hidden w-full xl:block xl:w-1/2">
        <div class="py-17.5 px-26 text-center">
          <router-link class="mb-5.5 inline-block" to="/">
           <img src="https://i.goopics.net/7r397g.png" alt="logo" class="h-24">
          </router-link>

          <p class="font-medium 2xl:px-20 text-sm py-2 text-gray-400">
            Boutique des Sens, Découvrez l'Art des Parfums Exclusifs.
          </p>

          <span class="mt-15 inline-block">
           <Icons iconName="illustrationLogin"/>
          </span>
        </div>
      </div>
      <div class="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
        <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span class="mb-1.5 block font-medium">{{ props.subtitle }}</span>
          <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            {{ props.title }}
          </h2>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  <!-- ====== Forms Section End -->
</template>
