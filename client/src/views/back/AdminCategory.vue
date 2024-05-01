<script setup lang="ts">
  import { ref } from 'vue';
  import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
  
  const editCategoryModalOpen = ref(false);
  const addCategoryModalOpen = ref(false);
  
  const editedCategory = ref({
    name: '',
    description: ''
  });
  
  const newCategory = ref({
    name: '',
    description: ''
  });
  
  const editCategory = () => {
    console.log('Édition de la catégorie', editedCategory.value);
    editedCategory.value = { name: '', description: '' };
    editCategoryModalOpen.value = false;
  };
  
  const addCategory = () => {
    console.log('Ajout d\'une nouvelle catégorie', newCategory.value);
    newCategory.value = { name: '', description: '' };
    addCategoryModalOpen.value = false;
  };
  </script>
<template>
    <DefaultLayout>
      <div class="container mx-auto">
        <h1 class="text-3xl font-semibold mb-8 text-white mt-5">Gestion des Catégories</h1>
        
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
                <th class="py-3 px-4 text-left">Nom</th>
                <th class="py-3 px-4 text-left">Description</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200">
                <td class="py-4 px-4 whitespace-nowrap">Electronique</td>
                <td class="py-4 px-4 whitespace-nowrap">Catégorie pour les produits électroniques</td>
                <td class="py-4 px-4 text-center">
                  <button @click="editCategoryModalOpen = true" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2">Éditer</button>
                  <button class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">Supprimer</button>
                </td>
              </tr>
              <!-- Fin de l'exemple -->
            </tbody>
          </table>
        </div>
        
        <div class="text-right mt-8">
          <button @click="addCategoryModalOpen = true" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded">Ajouter Catégorie</button>
        </div>
        
        <div v-if="editCategoryModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-8 max-w-md mx-auto rounded-lg">
            <h2 class="text-2xl font-semibold mb-4 text-black">Éditer Catégorie</h2>
            <form @submit.prevent="editCategory">
              <div class="mb-4">
                <label for="editName" class="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="editName" v-model="editedCategory.name" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="editDescription" class="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" id="editDescription" v-model="editedCategory.description" class="mt-1 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="text-right">
                <button type="button" @click="editCategoryModalOpen = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Annuler</button>
                <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
        
        <div v-if="addCategoryModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-8 max-w-md mx-auto rounded-lg">
            <h2 class="text-2xl font-semibold mb-4 text-black">Ajouter Catégorie</h2>
            <form @submit.prevent="addCategory">
              <div class="mb-4">
                <label for="addName" class="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="addName" v-model="newCategory.name" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="addDescription" class="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" id="addDescription" v-model="newCategory.description" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="text-right">
                <button type="button" @click="addCategoryModalOpen = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Annuler</button>
                <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  