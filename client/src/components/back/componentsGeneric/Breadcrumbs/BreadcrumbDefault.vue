<script setup lang="ts">
const props = defineProps<{
  pageTitle: string;
  linkText?: string; 
  linkTo?: string;
}>();
</script>

<template>
  <div class="mb-6 flex flex-col gap-3 my-5 mx-7 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-title-md2 font-semibold text-black">
      {{ props.pageTitle }}
    </h2>

    <nav>
      <ol class="flex items-center gap-2">
        <li>
          <router-link class="font-medium" :to="props.linkTo || '/admin'">
            {{ props.linkText || 'Dashboard' }} /
          </router-link>
        </li>
        <li class="font-medium !text-primary">{{ props.pageTitle }}</li>
      </ol>
    </nav>
  </div>
</template>

