<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import alertServices from '../../services/alertServices';

const store = useStore();
const userId = store.state.user.id;
const alerts = ref({
  newProduct: false,
  restock: false,
  priceChange: false
});

const notification = ref({
  show: false,
  message: ''
});

const loadAlerts = async () => {
  try {
    const userAlerts = await alertServices.getAlerts(userId);
    alerts.value = userAlerts;
  } catch (error) {
    showNotification('Erreur lors du chargement des paramètres d\'alerte.');
  }
};

const submitAlertSettings = async () => {
  try {
    const updatedAlerts = await alertServices.updateAlerts(userId, alerts.value);
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
onMounted(loadAlerts);
</script>

<template>
    <DefaultLayout>
      <BreadcrumbDefault :pageTitle="pageTitle" linkText="Accueil" linkTo="/" />
      <div class="profile-alerts-container mx-auto my-6 p-4 shadow rounded bg-white">
        <h1 class="text-2xl font-bold mb-4">Gestion des alertes par mail</h1>
        <form @submit.prevent="submitAlertSettings">
          <div class="alert-option">
            <input type="checkbox" id="newProductAlert" v-model="alerts.newProduct">
            <label for="newProductAlert">Alerte sur les nouveaux produits d'une catégorie</label>
          </div>
          <div class="alert-option">
            <input type="checkbox" id="restockAlert" v-model="alerts.restock">
            <label for="restockAlert">Alerte sur le restock d'un produit</label>
          </div>
          <div class="alert-option">
            <input type="checkbox" id="priceChangeAlert" v-model="alerts.priceChange">
            <label for="priceChangeAlert">Alerte sur les changements de prix</label>
          </div>
          <ButtonDefault label="Enregistrer les préférences" customClasses="bg-[#D8B775] text-white rounded-md" />
        </form>
        <div v-if="notification.show" class="notification absolute top-[4rem] right-[30rem] bg-green-500 text-white px-4 py-2 rounded shadow">
          {{ notification.message }}
        </div>
      </div>
    </DefaultLayout>
  </template>
  

  <style scoped>
  .profile-alerts-container {
    max-width: 600px;
  }
  .alert-option {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .alert-option label {
    margin-left: 8px;
  }
  .notification {
    transition: opacity 0.5s ease-in-out;
  }
  </style>
  