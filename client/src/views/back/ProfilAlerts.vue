<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import alertServices from '../../services/alertServices';
import productService from '../../services/ProductService.js';
import getImagePath from '@/utils/getImagePath';

const store = useStore();
const userId = store.state.user.id;

const alerts = ref({
  newProductCategories: [],
  restockProductIds: [],
  priceChangeProductIds: []
});

const products = ref([]);
const notification = ref({
  show: false,
  message: ''
});

const loadAlerts = async () => {
  try {
    const userAlerts = await alertServices.getAlerts(userId);
    if (userAlerts && userAlerts.length > 0) {
      alerts.value = userAlerts[0]; // Assuming only one alert settings per user
    }
  } catch (error) {
    showNotification('Erreur lors du chargement des paramètres d\'alerte.');
  }
};

const loadProducts = async () => {
  try {
    const response = await productService.getSequelizeProducts();
    products.value = response;
  } catch (error) {
    showNotification('Erreur lors du chargement des produits.');
  }
};

const submitAlertSettings = async () => {
  try {
    if (alerts.value.id) {
      await alertServices.updateAlert(alerts.value.id, alerts.value);
    } else {
      await alertServices.createAlert({ userId, ...alerts.value });
    }
    showNotification('Sauvegarde des paramètres d\'alerte réussie.');
  } catch (error) {
    showNotification('Erreur lors de la sauvegarde des paramètres d\'alerte.');
  }
};

const showNotification = (message: string) => {
  notification.value.message = message;
  notification.value.show = true;
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const pageTitle = 'Alertes';
onMounted(() => {
  loadAlerts();
  loadProducts();
});
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" linkText="Accueil" linkTo="/" />
    <div class="profile-alerts-container mx-auto my-6 p-6 shadow-lg rounded-lg bg-white">
      <h1 class="text-3xl font-bold mb-6">Gestion des alertes par mail</h1>
      <form @submit.prevent="submitAlertSettings">
        <div class="alert-option mb-6">
          <label class="block text-lg font-medium mb-2">Catégories de nouveaux produits :</label>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              id="category-homme"
              value="homme"
              v-model="alerts.newProductCategories"
              class="mr-2"
            />
            <label for="category-homme" class="text-lg">Homme</label>
          </div>
          <div class="flex items-center">
            <input
              type="checkbox"
              id="category-femme"
              value="femme"
              v-model="alerts.newProductCategories"
              class="mr-2"
            />
            <label for="category-femme" class="text-lg">Femme</label>
          </div>
        </div>
        <div class="alert-option mb-6">
          <label class="block text-lg font-medium mb-2">Produits pour restock :</label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="product in products" :key="product.id" class="product-item bg-gray-100 p-4 rounded-lg shadow">
              <img :src="getImagePath(product.image)" alt="Product Image" class="w-full h-32 object-cover mb-2 rounded-md" />
              <div class="flex items-center mb-2">
                <input
                  type="checkbox"
                  :id="'restock-' + product.id"
                  :value="product.id"
                  v-model="alerts.restockProductIds"
                  class="mr-2"
                />
                <label :for="'restock-' + product.id" class="text-sm">{{ product.name }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="alert-option mb-6">
          <label class="block text-lg font-medium mb-2">Produits pour changement de prix :</label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="product in products" :key="product.id" class="product-item bg-gray-100 p-4 rounded-lg shadow">
              <img :src="getImagePath(product.image)" alt="Product Image" class="w-full h-32 object-cover mb-2 rounded-md" />
              <div class="flex items-center mb-2">
                <input
                  type="checkbox"
                  :id="'price-' + product.id"
                  :value="product.id"
                  v-model="alerts.priceChangeProductIds"
                  class="mr-2"
                />
                <label :for="'price-' + product.id" class="text-sm">{{ product.name }}</label>
              </div>
            </div>
          </div>
        </div>
        <ButtonDefault label="Enregistrer les préférences" customClasses="bg-[#D8B775] text-white rounded-md px-4 py-2" />
      </form>
      <div v-if="notification.show" class="notification fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
        {{ notification.message }}
      </div>
    </div>
  </DefaultLayout>
</template>


<style scoped>
.profile-alerts-container {
  max-width: 800px;
}
.alert-option {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.product-item img {
  border-radius: 0.5rem;
}
.notification {
  transition: opacity 0.5s ease-in-out;
}
</style>
