<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onMounted, ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import OrderCard from '@/components/back/componentsGeneric/order/ProductCard.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import BreadcrumbDefault from '@/components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import OrderService from '../../services/OrderService';
import store from '../../store/store.js';


const pageTitle = ref('Commandes');
const Orders =ref([]);
const user_id = store.state.user.id;

const fetchOrdersForAdmin = async () => {
  try {
    const response = await OrderService.getAllOrders();
    Orders.value = response;
  } catch (error) {
    console.error('Error fetching families:', error);
    
  }
};


onMounted(async () => {
  await fetchOrdersForAdmin();  
  
});

</script>
<template>

  
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="container mx-auto">
<div> {{ Orders }}</div>


      
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
