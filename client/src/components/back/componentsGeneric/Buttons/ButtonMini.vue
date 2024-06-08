<script setup lang="ts">
const props = defineProps(['label', 'route', 'customClasses'])
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2.5 py-2 px-3 mx-2 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-3"
    :class="props.customClasses"
  >
    <slot></slot>
    {{ props.label }}
  </button>
</template>
