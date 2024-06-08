<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BrandService from '../../services/BrandService';
import { useStore } from 'vuex';

const store = useStore();

const newBrand = ref({ name: '' });
const brands = ref([]);
const isAdmin = computed(() => store.state.user && store.state.user.role === 'admin');

const fetchBrands = async () => {
  try {
    const response = await BrandService.getAllBrands();
    brands.value = response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
};

const submitForm = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await BrandService.createBrand(newBrand.value);
    newBrand.value.name = '';
    fetchBrands();
  } catch (error) {
    console.error('Error creating brand:', error);
  }
};

const removeBrand = async (id: number) => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await BrandService.deleteBrand(id);
    fetchBrands();
  } catch (error) {
    console.error('Error deleting brand:', error);
  }
};

onMounted(() => {
  fetchBrands();
});
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-6">Gestion des marques</h1>
      <div v-if="isAdmin" class="mb-10">
        <h2 class="text-2xl font-medium text-gray-800 mb-4">Création d'une marque</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="brandName" class="block text-sm font-medium text-gray-700">Nom de la marque</label>
            <input
              id="brandName"
              v-model="newBrand.name"
              type="text"
              placeholder="Entrez le nom de la marque"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-50 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Créer
          </button>
        </form>
      </div>
      <h2 class="text-2xl font-medium text-gray-800 mb-4">Les marques</h2>
      <ul class="space-y-4">
        <li
          v-for="brand in brands"
          :key="brand.id"
          class="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
        >
          <span class="text-lg font-medium text-gray-900">{{ brand.name }}</span>
          <button
            v-if="isAdmin"
            @click="removeBrand(brand.id)"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </div>
  </DefaultLayout>
</template>