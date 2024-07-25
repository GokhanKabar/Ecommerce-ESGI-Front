<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  checked: Boolean,
});

const emit = defineEmits(['update:checked', 'change']);

const localChecked = ref(props.checked);

watch(() => props.checked, (newValue) => {
  localChecked.value = newValue;
});

watch(localChecked, (newValue) => {
  emit('update:checked', newValue);
});
</script>

<template>
  <div class="flex items-center space-x-2">
    <input
      type="checkbox"
      id="rgpd"
      v-model="localChecked"
      @change="$emit('change', $event)"
      class="w-4 h-4 text-primary form-checkbox rounded"
    />
    <label for="rgpd">
      <router-link to="/protection-donnees" class="!text-primary"> J'accepte la politique de gestion des données personnelles.</router-link>
    </label>
  </div>
</template>
