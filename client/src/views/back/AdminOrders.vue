<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';

import DataTable from '../../components/back/componentsGeneric/DataTable.vue';
import OrderPopup from '../../components/back/componentsGeneric/order/OrderPopup.vue';
import OrderCard from '@/components/back/componentsGeneric/order/ProductCard.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';

import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import OrderService from '../../services/OrderService';
import store from '../../store/store.js';


const pageTitle = ref('Commandes');
const Orders = ref([]);
const user_id = store.state.user.id;
const headers = ['id', 'lastName', 'email', 'delivery_status', 'payment_status', 'date_order'];
const showOrderDetailsPopup = ref(false);

const fetchOrdersForAdmin = async () => {
  try {
    const response = await OrderService.getAllOrders();
    Orders.value = response;
  } catch (error) {
    console.error('Error fetching families:', error);

  }
};

const showPopup = ref(false);
const orderDetails = ref({});

const showOrderDetails = async (order) => {
  try {
    const response = await OrderService.getOrderDetails(order.id);
    orderDetails.value = response;
    showPopup.value = true;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};

const closePopup = () => {
  showPopup.value = false;
};

onMounted(async () => {
  await fetchOrdersForAdmin();

});

</script>
<template>


  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    

    <DataTable :headers="headers" :data="Orders" :filterableColumns="headers" :editUser="showOrderDetails"
      :deleteUser="confirmDeleteProduct" />
   
      <OrderPopup :isVisible="showPopup" :orderDetails="orderDetails" @delete="" @close="closePopup" />

    



  </DefaultLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}


.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}


.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}


.fade-enter, .fade-leave-to {

  opacity: 0;
}
</style>
