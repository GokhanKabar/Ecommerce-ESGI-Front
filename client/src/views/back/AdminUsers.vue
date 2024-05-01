<script setup lang="ts">
import { ref } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';

const editUserModalOpen = ref(false);
const addUserModalOpen = ref(false);

const editedUser = ref({
  name: '',
  email: '',
  role: ''
});

const newUser = ref({
  name: '',
  email: '',
  role: ''
});

const editUser = () => {
  console.log('Édition utilisateur', editedUser.value);
  editedUser.value = { name: '', email: '', role: '' };
  editUserModalOpen.value = false;
};

const addUser = () => {
  console.log('Ajout nouvel utilisateur', newUser.value);
  newUser.value = { name: '', email: '', role: '' };
  addUserModalOpen.value = false;
};
</script>

<template>
    <DefaultLayout>
      <div class="container mx-auto mt-5">
        <h1 class="text-3xl font-semibold mb-8 text-white">Gestion des Utilisateurs</h1>
        
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
                <th class="py-3 px-4 text-left">Nom</th>
                <th class="py-3 px-4 text-left">Email</th>
                <th class="py-3 px-4 text-center">Rôle</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200">
                <td class="py-4 px-4 whitespace-nowrap">Admin</td>
                <td class="py-4 px-4 whitespace-nowrap">admin@mail.fr</td>
                <td class="py-4 px-4 text-center">Admin</td>
                <td class="py-4 px-4 text-center">
                  <button @click="editUserModalOpen = true" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2">Éditer</button>
                  <button class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="text-right mt-8">
          <button @click="addUserModalOpen = true" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded">Ajouter Utilisateur</button>
        </div>
        
        <div v-if="editUserModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-8 max-w-md mx-auto rounded-lg">
            <h2 class="text-2xl font-semibold mb-4 text-black">Éditer Utilisateur</h2>
            <form @submit.prevent="editUser">
              <div class="mb-4">
                <label for="editName" class="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="editName" v-model="editedUser.name" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="editEmail" v-model="editedUser.email" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="editRole" class="block text-sm font-medium text-gray-700">Rôle</label>
                <input type="text" id="editRole" v-model="editedUser.role" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="text-right">
                <button type="button" @click="editUserModalOpen = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Annuler</button>
                <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
        
        <div v-if="addUserModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-8 max-w-md mx-auto rounded-lg">
            <h2 class="text-2xl font-semibold mb-4 text-black">Ajouter Utilisateur</h2>
            <form @submit.prevent="addUser">
              <div class="mb-4">
                <label for="addName" class="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="addName" v-model="newUser.name" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="addEmail" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="addEmail" v-model="newUser.email" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="mb-4">
                <label for="addRole" class="block text-sm font-medium text-gray-700">Rôle</label>
                <input type="text" id="addRole" v-model="newUser.role" class="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400">
              </div>
              <div class="text-right">
                <button type="button" @click="addUserModalOpen = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Annuler</button>
                <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  