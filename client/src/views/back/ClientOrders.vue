<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import OrderCard from '../../components/back/componentsGeneric/order/ProductCard.vue';
import PromoCard from '../../components/back/componentsGeneric/order/CardPerfumePromo.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import OrderService from '../../services/OrderService';
import ProductService from '../../services/ProductService';
import store from '../../store/store.js';


const pageTitle = ref('Mes Commandes');
const Orders = ref([]);
const Promo = ref([]);
const Order = ref([]);
const user_id = store.state.user.id;

const fetchOrdersForUser = async () => {
  try {
    const response = await OrderService.getOrderByUser(user_id);
    Orders.value = response.formattedOrders;
  } catch (error) {
    console.error('Error fetching families:', error);

  }
};

const fetchPromotionalProducts = async () => {
  try {
    const response = await ProductService.getAllProductsPromo();
    Promo.value = response;
  } catch (error) {
    console.error('Error fetching families:', error);

  }
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}
function calculateDiscountedPrice(price: number, promotion: number): string {
  const discountedPrice = price - (price * promotion) / 100;
  return formatPrice(discountedPrice);
}

const OrderAgain = async (order) => {
  try {
    Order.value = order;
    // Exemple de logique pour ajouter les produits au panier
    order.products.forEach(product => {
      store.dispatch('addProductToCart', {
        id: product.id,
        name: product.name,
        price: product.promotion
          ? calculateDiscountedPrice(product.price, product.promotion)
          : product.price,
        promo: product.promotion,
        image: product.image,
        quantity: product.quantity,
      });
    })

  } catch (error) {
    console.error('Error fetching families:', error);

  }
};

onMounted(async () => {
  await fetchOrdersForUser();
  await fetchPromotionalProducts();
});



</script>
<template>


  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" linkText="Accueil" linkTo="/" />
    <div class="container mx-auto flex">
      <OrderCard :reorder="OrderAgain" :orders="Orders" />
      <PromoCard :products="Promo" />
    </div>

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
</style>
