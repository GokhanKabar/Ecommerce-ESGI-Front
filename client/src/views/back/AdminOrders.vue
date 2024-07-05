<script setup lang="ts">
import { ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import ProgressLine from '@/components/back/componentsGeneric/order/ProgressLine.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';

const orders = ref([
  { 
    id: 1, 
    userName: 'Utilisateur 1', 
    date: '2024-05-01', 
    status: 'En attente', 
    price: 50.99, 
    deliveryType: 'Livraison express', 
    products: [
      { id: 1, name: 'Produit 1', quantity: 2 },
      { id: 2, name: 'Produit 2', quantity: 1 },
    ] 
  },
  { 
    id: 2, 
    userName: 'Utilisateur 2', 
    date: '2024-04-28', 
    status: 'Livré', 
    price: 99.99, 
    deliveryType: 'Livraison standard', 
    products: [
      { id: 2, name: 'Produit 2', quantity: 3 },
    ] 
  },
  { 
    id: 3, 
    userName: 'Utilisateur 3', 
    date: '2024-04-25', 
    status: 'En cours', 
    price: 25.99, 
    deliveryType: 'Livraison express', 
    products: [
      { id: 1, name: 'Produit 1', quantity: 1 },
      { id: 3, name: 'Produit 3', quantity: 2 },
    ] 
  },
]);


const deleteOrder = (orderId: number) => {
  const index = orders.value.findIndex((order) => order.id === orderId);
  if (index !== -1) {
    orders.value.splice(index, 1);
  }
};

</script>
<template>

  
  <DefaultLayout>
    <div class="container mx-auto">
<ProgressLine/>

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
