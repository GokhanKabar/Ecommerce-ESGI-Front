<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import OrderCard from '@/components/back/componentsGeneric/order/ProgressLine.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import OrderService from '../../services/OrderService';
import store from '../../store/store.js';

const Orders =ref([]);
const user_id = store.state.user.id;

const fetchOrdersForUser = async () => {
  try {
    const response = await OrderService.getOrderByUser(user_id);
    Orders.value = response.formattedOrders;
  } catch (error) {
    console.error('Error fetching families:', error);
    
  }
};


onMounted(async () => {
  await fetchOrdersForUser();  
  console.log('here'+Orders);
});

</script>
<template>

  
  <DefaultLayout>
    <div class="container mx-auto">
<OrderCard :orders="Orders"/>


      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <h1 class="text-3xl font-bold text-white mt-5">Gestion des Commandes</h1>
      </div>

      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Nom de l'utilisateur</th>
              <th class="px-4 py-2">Date de la commande</th>
              <th class="px-4 py-2">Statut</th>
              <th class="px-4 py-2">Prix</th>
              <th class="px-4 py-2">Type de livraison</th>
              <th class="px-4 py-2">Produits</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="border px-4 py-2">{{ order.id }}</td>
              <td class="border px-4 py-2">{{ order.userName }}</td>
              <td class="border px-4 py-2">{{ order.date }}</td>
              <td class="border px-4 py-2">{{ order.status }}</td>
              <td class="border px-4 py-2">{{ order.price }}</td>
              <td class="border px-4 py-2">{{ order.deliveryType }}</td>
              <td class="border px-4 py-2">
                <ul>
                  <li v-for="product in order.products" :key="product.id">{{ product.quantity }}x {{ product.name }}</li>
                </ul>
              </td>
              <td class="border px-4 py-2">
                <button @click="deleteOrder(order.id)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
