<!-- components/back/componentsGeneric/ConfirmationPopup.vue -->

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  message: String,
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>
<template>
    <div class="overlay" v-if="isVisible">
      <div class="popup">
        <div class=" flex flex-row justify-center">
        <svg class="w-20 h-20 text-red mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
        <p class="font-semibold">{{props. message }}</p>
        <div class="buttons">
          <button @click="confirm" class="bg-[#D8B775] text-white rounded px-5 py-2">Confirmer</button>
          <button @click="cancel" class="bg-red text-white rounded px-5 py-2">Annuler</button>
        </div>
      </div>
    </div>
  </template>
   <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  </style>
  