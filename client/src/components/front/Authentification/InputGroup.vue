<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">
      {{ props.label }}<span v-if="isRequired" class="text-red ml-1">*</span>
    </label>
    <div class="relative">
      <input
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.value"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />
      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['label', 'type', 'placeholder','value', 'isRequired'])
</script>
