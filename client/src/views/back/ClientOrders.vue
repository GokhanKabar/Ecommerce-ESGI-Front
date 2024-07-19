<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import OrderCard from '../../components/back/componentsGeneric/order/ProductCard.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import OrderService from '../../services/OrderService';
import store from '../../store/store.js';


const pageTitle = ref('Mes Commandes');
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
    <BreadcrumbDefault :pageTitle="pageTitle"  linkText="Accueil" linkTo="/"  />
    <div class="container mx-auto">
<OrderCard :orders="Orders"/>


      
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
