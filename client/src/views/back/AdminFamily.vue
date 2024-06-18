<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import FamilyService from '../../services/FamilyService';
import { useStore } from 'vuex';

const store = useStore();

const newFamily = ref({ name: '' });
const families = ref([]);
const isAdmin = computed(() => store.state.user && store.state.user.role === 'ADMIN');

const fetchFamilies = async () => {
  try {
    const response = await FamilyService.getAllFamilies();
    families.value = response.data;
  } catch (error) {
    console.error('Error fetching families:', error);
  }
};

const submitForm = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await FamilyService.createFamily(newFamily.value);
    newFamily.value.name = '';
    fetchFamilies();
  } catch (error) {
    console.error('Error creating family:', error);
  }
};

const removeFamily = async (id: number) => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await FamilyService.deleteFamily(id);
    fetchFamilies();
  } catch (error) {
    console.error('Error deleting family:', error);
  }
};

onMounted(() => {
  fetchFamilies();
});
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-6">Gestion des familles</h1>
      <div v-if="isAdmin" class="mb-10">
        <h2 class="text-2xl font-medium text-gray-800 mb-4">Création d'une famille</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="familyName" class="block text-sm font-medium text-gray-700">Nom de la famille</label>
            <input
              id="familyName"
              v-model="newFamily.name"
              type="text"
              placeholder="Entrez le nom de la famille"
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
      <h2 class="text-2xl font-medium text-gray-800 mb-4">Les familles</h2>
      <ul class="space-y-4">
        <li
          v-for="family in families"
          :key="family.id"
          class="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
        >
          <span class="text-lg font-medium text-gray-900">{{ family.name }}</span>
          <button
            v-if="isAdmin"
            @click="removeFamily(family.id)"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </div>
  </DefaultLayout>
</template>