<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';


const currentPage = ref(1);
const pageSize = 3;
const props = defineProps<{
  orders: {
    orderId: number;
    deliveryStatus: string;
    paymentStatus: string;
    dateOrder: string;
    dateCreation: string;
    dateUpdate: string;
    orderStatus: string;
    userId: number;
    products: {
      id: number;
      name: string;
      description: string;
      category: string;
      price: number;
      stock: number;
      concentration: string;
      promotion: number;
      image: string;
      dateAdded: string;
      dateUpdated: string;
      createdAt: string;
      updatedAt: string;
      brandId: number;
      familyId: number;
      quantity: number;
      totalPrice: number;
    }[];
  }[];
}>();

const mappedOrders = computed(() => {
  return props.orders.map(order => {
    const totalItems = order.products.reduce((acc, product) => acc + product.quantity, 0);
    const totalPrice = order.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    return {
      ...order,
      totalItems,
      totalPrice
    };
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return mappedOrders.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(mappedOrders.value.length / pageSize);
});

const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const previousPage = () => {
  currentPage.value--;
};

const nextPage = () => {
  currentPage.value++;
};
</script>

<template>
  <div>
    <div v-if="mappedOrders.length === 0" class="text-center p-4">
      <p class="text-gray-500 text-6xl mx-8 my-6">Vous n'avez aucune commande.</p>
    </div>
    
    <div v-else>
  <div
    v-for="order in paginatedOrders"
    :key="order.orderId"
    class="border p-4 m-8 rounded shadow w-4/5 mx-auto list-none"
  >
    <div class="flex justify-between items-center p-4 rounded bg-slate-200">
     
      <span class="font-semibold">Commandé le : {{ new Date(order.dateOrder).toLocaleDateString() }}</span>
      <span class="font-semibold">Numéro de commande : {{ order.orderId }}</span>
    </div>
    <div class="flex justify-between border p-4 rounded bg-slate-100">
      <!-- Section de l'état de livraison -->
      <div class="flex items-center mb-2">
        <div class="mr-2">
          <!-- SVG en fonction de l'état de livraison -->
          
          <svg 
          v-if="order.deliveryStatus === 'confirmed'"
          width="26" height="29" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.3688 19.855C3.89155 19.2644 0.518066 15.4147 0.518066 10.8967C0.518066 5.91233 4.57039 1.8606 9.55547 1.8606C14.5406 1.8606 18.5929 5.91233 18.5929 10.8967C18.5929 11.1402 18.5825 11.3837 18.567 11.6221L17.686 11.5495C17.7016 11.3319 17.7119 11.1143 17.7119 10.8967C17.7119 6.39936 14.0535 2.74659 9.56066 2.74659C5.06268 2.74659 1.40937 6.40454 1.40937 10.8967C1.40937 14.9743 4.4512 18.4457 8.48798 18.9794L8.3688 19.855Z" fill="#D8B775"/>
          <path d="M17.1473 26.399L9.30688 24.5597V14.7153L17.1473 16.736V26.399Z" fill="#D8B775"/>
          <path d="M17.3907 26.3989L24.9927 24.7876V14.6531L17.3907 16.7359V26.3989Z" fill="#D8B775"/>
          <path d="M17.0436 12.3682L9.30688 14.4977L17.1473 16.4821L24.9928 14.4251L17.0436 12.3682Z" fill="#D8B775"/>
          <path d="M9.66444 11.6895L6.56042 8.58595L7.18745 7.95902L9.66444 10.4357L13.9396 6.16113L14.5666 6.78806L9.66444 11.6895Z" fill="#D8B775"/>
          <path d="M9.33276 4.18188H9.77317V5.06788H9.33276V4.18188Z" fill="#D8B775"/>
          <path d="M2.69983 10.814H3.58582V11.2544H2.69983V10.814Z" fill="#D8B775"/>
          <path d="M15.5253 10.814H16.4113V11.2544H15.5253V10.814Z" fill="#D8B775"/>
          <path d="M5.93896 5.21094L6.32037 4.99076L6.76341 5.758L6.38201 5.97818L5.93896 5.21094Z" fill="#D8B775"/>
          <path d="M3.50952 14.2722L4.27691 13.8294L4.49709 14.2108L3.7297 14.6536L3.50952 14.2722Z" fill="#D8B775"/>
          <path d="M14.6134 7.85864L15.3808 7.41578L15.601 7.79721L14.8336 8.24006L14.6134 7.85864Z" fill="#D8B775"/>
          <path d="M3.51123 7.79956L3.73146 7.41818L4.49875 7.86113L4.27853 8.24251L3.51123 7.79956Z" fill="#D8B775"/>
          <path d="M5.93933 16.8601L6.38229 16.0928L6.76374 16.3129L6.32078 17.0802L5.93933 16.8601Z" fill="#D8B775"/>
          <path d="M12.3461 5.75513L12.789 4.9878L13.1705 5.20793L12.7275 5.97526L12.3461 5.75513Z" fill="#D8B775"/>
        </svg>


          <svg
          v-else-if="order.deliveryStatus === 'in_progress'" 
          width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2_1300)">
          <path d="M11.766 23.7827C11.766 25.3899 10.4668 26.6891 8.85964 26.6891C7.25244 26.6891 5.95324 25.3899 5.95324 23.7827C5.95324 22.1755 7.25244 20.8763 8.85964 20.8763C10.4612 20.8763 11.766 22.1755 11.766 23.7827ZM10.31 23.7827C10.31 22.9819 9.66044 22.3323 8.85404 22.3323C8.05324 22.3323 7.39804 22.9819 7.39804 23.7827C7.39804 24.5835 8.04764 25.2331 8.85404 25.2331C9.66044 25.2331 10.31 24.5835 10.31 23.7827ZM6.69804 21.3635H1.18764C0.969239 21.3635 0.790039 21.5427 0.790039 21.7611V22.9595C0.790039 23.1779 0.969239 23.3571 1.18764 23.3571H5.60604C5.71804 22.5619 6.12124 21.8619 6.69804 21.3635ZM24.5676 23.8163C24.5676 25.4011 23.2796 26.6835 21.6948 26.6835C20.11 26.6835 18.822 25.4011 18.822 23.8163C18.822 22.2315 20.11 20.9491 21.6948 20.9491C23.2796 20.9491 24.5676 22.2315 24.5676 23.8163ZM23.1284 23.8163C23.1284 23.0211 22.4844 22.3827 21.6948 22.3827C20.8996 22.3827 20.2612 23.0267 20.2612 23.8163C20.2612 24.6115 20.9052 25.2499 21.6948 25.2499C22.49 25.2555 23.1284 24.6115 23.1284 23.8163ZM27.67 21.7611V22.9595C27.67 23.1779 27.4908 23.3571 27.2724 23.3571H24.9036C24.674 21.7891 23.3244 20.5739 21.6892 20.5739C20.054 20.5739 18.7044 21.7835 18.4748 23.3571H12.0292C11.9116 22.5675 11.514 21.8675 10.9372 21.3691H17.0468V11.3003C17.0468 10.8635 17.3996 10.5107 17.8364 10.5107H21.5716C22.6244 10.5107 23.6044 11.0315 24.1924 11.9051L26.6004 15.4667C26.9532 15.9875 27.1436 16.6035 27.1436 17.2363V21.3635H27.278C27.4908 21.3635 27.67 21.5427 27.67 21.7611ZM24.8924 15.0299L22.6188 11.7987C22.5292 11.6755 22.3892 11.6027 22.238 11.6027H18.6876C18.43 11.6027 18.2228 11.8099 18.2228 12.0675V15.2987C18.2228 15.5563 18.43 15.7635 18.6876 15.7635H24.5116C24.8868 15.7691 25.1108 15.3379 24.8924 15.0299Z" fill="#D8B775"/>
          <path d="M0.790039 6.68018H7.05084V20.8762H0.790039V6.68018Z" fill="#D8B775"/>
          <path d="M10.3101 6.68018H16.5709V20.8762H10.3101V6.68018Z" fill="#D8B775"/>
          <path d="M7.29712 6.68018H10.1587V20.8762H7.29712V6.68018Z" fill="#D8B775"/>
          <path d="M4.35155 2.63135C2.68275 2.63135 -0.733252 4.45135 1.55715 6.52895H8.48995C8.48995 6.52895 6.01475 2.63135 4.35155 2.63135ZM3.19235 4.46815C4.82755 3.13535 7.90195 6.23215 7.90195 6.23215C4.99555 6.09775 1.55155 5.80095 3.19235 4.46815Z" fill="#D8B775"/>
          <path d="M8.5293 6.52895H15.4621C17.7469 4.45135 14.3309 2.63135 12.6677 2.63135C11.0045 2.63135 8.5293 6.52895 8.5293 6.52895ZM9.1229 6.23215C9.1229 6.23215 12.1917 3.13535 13.8325 4.46815C15.4621 5.80095 12.0237 6.09775 9.1229 6.23215Z" fill="#D8B775"/>
          </g>
          <defs>
          <clipPath id="clip0_2_1300">
          <rect width="28" height="28" fill="white" transform="translate(0.22998 0.660156)"/>
          </clipPath>
          </defs>
          </svg>


          <svg
          v-else-if="order.deliveryStatus === 'delivered'"
           width="26" height="29" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.3688 19.855C3.89155 19.2644 0.518066 15.4147 0.518066 10.8967C0.518066 5.91233 4.57039 1.8606 9.55547 1.8606C14.5406 1.8606 18.5929 5.91233 18.5929 10.8967C18.5929 11.1402 18.5825 11.3837 18.567 11.6221L17.686 11.5495C17.7016 11.3319 17.7119 11.1143 17.7119 10.8967C17.7119 6.39936 14.0535 2.74659 9.56066 2.74659C5.06268 2.74659 1.40937 6.40454 1.40937 10.8967C1.40937 14.9743 4.4512 18.4457 8.48798 18.9794L8.3688 19.855Z" fill="#D8B775"/>
          <path d="M17.1473 26.399L9.30688 24.5597V14.7153L17.1473 16.736V26.399Z" fill="#D8B775"/>
          <path d="M17.3907 26.3989L24.9927 24.7876V14.6531L17.3907 16.7359V26.3989Z" fill="#D8B775"/>
          <path d="M17.0436 12.3682L9.30688 14.4977L17.1473 16.4821L24.9928 14.4251L17.0436 12.3682Z" fill="#D8B775"/>
          <path d="M9.66444 11.6895L6.56042 8.58595L7.18745 7.95902L9.66444 10.4357L13.9396 6.16113L14.5666 6.78806L9.66444 11.6895Z" fill="#D8B775"/>
          <path d="M9.33276 4.18188H9.77317V5.06788H9.33276V4.18188Z" fill="#D8B775"/>
          <path d="M2.69983 10.814H3.58582V11.2544H2.69983V10.814Z" fill="#D8B775"/>
          <path d="M15.5253 10.814H16.4113V11.2544H15.5253V10.814Z" fill="#D8B775"/>
          <path d="M5.93896 5.21094L6.32037 4.99076L6.76341 5.758L6.38201 5.97818L5.93896 5.21094Z" fill="#D8B775"/>
          <path d="M3.50952 14.2722L4.27691 13.8294L4.49709 14.2108L3.7297 14.6536L3.50952 14.2722Z" fill="#D8B775"/>
          <path d="M14.6134 7.85864L15.3808 7.41578L15.601 7.79721L14.8336 8.24006L14.6134 7.85864Z" fill="#D8B775"/>
          <path d="M3.51123 7.79956L3.73146 7.41818L4.49875 7.86113L4.27853 8.24251L3.51123 7.79956Z" fill="#D8B775"/>
          <path d="M5.93933 16.8601L6.38229 16.0928L6.76374 16.3129L6.32078 17.0802L5.93933 16.8601Z" fill="#D8B775"/>
          <path d="M12.3461 5.75513L12.789 4.9878L13.1705 5.20793L12.7275 5.97526L12.3461 5.75513Z" fill="#D8B775"/>
        </svg>


          <svg
            v-else
            class="w-6 h-6 text-red-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4m0 0h0v4m0-4h-2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <div class="font-semibold">
            {{ order.deliveryStatus === 'confirmed'
              ? 'Confirmé'
              : order.deliveryStatus === 'in_progress'
              ? 'En cours de livraison'
              : order.deliveryStatus === 'delivered'
              ? 'Livré'
              : 'En retard' }}
          </div>
          <div class="text-sm text-gray-600">{{ new Date(order.dateOrder).toLocaleDateString() }}</div>
        </div>
      </div>
      <!-- Section du paiement -->
      <div>
        <div class="font-semibold">
          Total : <span>{{ order.totalPrice }}</span> €
        </div>
        <div>
          <span v-if="order.paymentStatus === 'not payed'" class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-800" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a.75.75 0 10-1.06-1.06L10 9.94 7.524 7.466a.75.75 0 10-1.06 1.06L8.94 11l-2.476 2.474a.75.75 0 001.06 1.06L10 12.06l2.474 2.474a.75.75 0 101.06-1.06L11.06 11l2.476-2.474z" clip-rule="evenodd" />
            </svg>
            <span class="ml-1">Non payé</span>
          </span>
          <span v-else class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-800" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
            </svg>
            <span class="ml-1">Payé</span>
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4 items-center">
      <!-- Carousel section -->
      <div class="col-span-2">
        <div class="w-full mx-8">
          <v-carousel height="200" hide-delimiters>
            <v-carousel-item v-for="(product, i) in order.products" :key="i">
              <img :src="product.image" alt="Slide" class="w-full h-full object-cover" />
            </v-carousel-item>
          </v-carousel>
        </div>
        <div class="flex justify-center mx-20 text-lg">{{ order.totalItems }} articles</div>
      </div>

      <!-- Buttons section -->
      <div class="col-span-2 flex flex-col space-y-2 m-12">
        <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded">Suivre</button>
        <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded">Renvoyer l'article</button>
        <ButtonDefault @click="" label="Passer à la caisse" customClasses="bg-[#D8B775] text-white rounded-md">
        </ButtonDefault>
      </div>
    </div>
  </div>
</div>



     <!-- Pagination controls -->
     <div class="flex justify-center items-center my-2">
      <svg @click="currentPage !== 1 ? previousPage() : null" :class="{ 'disabled': currentPage === 1 }" fill="#000000"
           height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512"
           xml:space="preserve">
<path d="M274.3,262.5L512,381.4V143.6L274.3,262.5z M36.6,262.5l237.7,118.9V262.5V143.6L36.6,262.5z M0,143.6v237.7h36.6V262.5
	V143.6H0z"/>
</svg>
      <span class="mx-4">Page {{ currentPage }} of {{ totalPages }}</span>

      <svg @click="currentPage !== totalPages ? nextPage() : null" :class="{ 'disabled': currentPage === totalPages }"
           fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512"
           xml:space="preserve">
<path d="M0,381.4l237.7-118.9L0,143.6V381.4z M237.7,262.5v118.9l237.7-118.9L237.7,143.6V262.5z M475.4,143.6v118.9v118.9H512
	V143.6H475.4z"/>
</svg>
    </div>

  </div>
</template>

<style scoped>
/* Vous pouvez ajouter des styles pour le message ici si nécessaire */
</style>
