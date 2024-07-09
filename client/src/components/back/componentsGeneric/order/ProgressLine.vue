<script setup lang="ts">
import { defineProps, computed } from 'vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
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
</script>

<template>
  <div v-if="mappedOrders.length">
    <div v-for="order in mappedOrders" :key="order.orderId" class="border p-4 m-8 rounded shadow w-4/5 mx-auto list-none">
      <div class="flex justify-between items-center p-4 rounded bg-slate-200">
        <span class="text-gray-600">{{ new Date(order.dateOrder).toLocaleDateString() }}</span>
        <span class="font-semibold">Numéro de commande {{ order.orderId }}</span>
      </div>
      <div class="flex justify-between border p-4 rounded bg-slate-100">
        <div class="flex items-center mb-2">
          <div class="mr-2">
            <svg class="w-6 h-6 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.1265 9.17158L10.409 15.8891L6.87347 12.3536L7.58058 11.6465L10.409 14.4745L16.4194 8.46448L17.1265 9.17158Z" fill="currentColor"></path>
            </svg>
          </div>
          <div>
            <div class="font-semibold">Signé</div>
            <div class="text-sm text-gray-600">{{ new Date(order.dateOrder).toLocaleDateString() }}</div>
          </div>
        </div>
        <div>
          <div class="font-semibold">Total : <span>{{ order.totalPrice }}</span> € </div>
          <div class="text-sm text-gray-600">{{ order.paymentStatus === 'non' ? 'Non payé' : 'Payé' }}</div>
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
</template>
