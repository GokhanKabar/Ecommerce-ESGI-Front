<template>
    <div class="relative flex items-center justify-between w-full mt-8">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full h-1 bg-gray-300"></div>
        <div
          class="h-1 bg-[#D8B775]"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="relative flex flex-col items-center"
      >
        <span
          class="mb-2 text-sm font-semibold"
          :class="{ 'text-[#D8B775]': currentStep >= index, 'text-gray-400': currentStep < index }"
        >
          {{ step }}
        </span>
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full border-2"
          :class="{ 'border-[#D8B775] bg-[#D8B775] text-white': currentStep >= index, 'border-gray-300': currentStep < index }"
        >
          <svg
            v-if="currentStep >= index"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"
            />
            <path
              d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-4 4.5a.75.75 0 0 1-1.08 0l-2-2.5a.75.75 0 1 1 1.16-.97l1.45 1.81 3.4-3.89z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentStep: {
        type: Number,
        required: true,
      },
    },
    computed: {
      steps() {
        return ['Commande Confirmée', 'En Livraison', 'Livrée'];
      },
      progressPercentage() {
        return (this.currentStep / (this.steps.length - 1)) * 100;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Aucun style supplémentaire n'est nécessaire ici, car nous utilisons Tailwind CSS */
  </style>
  