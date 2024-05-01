<script setup lang="ts">
import { ref, reactive } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';

const products = ref([
  { id: 1, name: 'Produit 1', description: 'Description du Produit 1', price: 10.99, category: 'Catégorie 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Produit 2', description: 'Description du Produit 2', price: 19.99, category: 'Catégorie 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Produit 3', description: 'Description du Produit 3', price: 5.99, category: 'Catégorie 1', image: 'https://via.placeholder.com/150' },
]);

const showModal = ref(false);
const modalTitle = ref('');
const form = reactive({
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
});

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.price = 0;
  form.category = '';
  form.image = '';
};

const editProduct = (product) => {
  modalTitle.value = 'Modifier le Produit';
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.category = product.category;
  form.image = product.image;
  showModal.value = true;
};

const deleteProduct = (productId: number) => {
  const index = products.value.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products.value.splice(index, 1);
  }
};

const submitForm = () => {
  if (modalTitle.value === 'Modifier le Produit') {
    const index = products.value.findIndex((product) => product.name === form.name);
    if (index !== -1) {
      products.value[index].description = form.description;
      products.value[index].price = form.price;
      products.value[index].category = form.category;
      products.value[index].image = form.image;
    }
  } else {
    const newProduct = {
      id: products.value.length + 1,
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      image: form.image,
    };
    products.value.push(newProduct);
  }
  closeModal();
};

</script>
<template>
  <DefaultLayout>
    <div class="container mx-auto">
      <div class="flex justify-between items-center border-b pb-4 mb-8">
        <h1 class="text-3xl font-bold text-white mt-5">Gestion des Produits</h1>
        <button @click="toggleModal" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Ajouter un Produit</button>
      </div>

      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Nom</th>
              <th class="px-4 py-2">Description</th>
              <th class="px-4 py-2">Prix</th>
              <th class="px-4 py-2">Catégorie</th>
              <th class="px-4 py-2">Image</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="border px-4 py-2">{{ product.id }}</td>
              <td class="border px-4 py-2">{{ product.name }}</td>
              <td class="border px-4 py-2">{{ product.description }}</td>
              <td class="border px-4 py-2">{{ product.price }}</td>
              <td class="border px-4 py-2">{{ product.category }}</td>
              <td class="border px-4 py-2"><img :src="product.image" alt="Product Image" class="w-24 h-24"></td>
              <td class="border px-4 py-2">
                <button @click="editProduct(product)" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">Modifier</button>
                <button @click="deleteProduct(product.id)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div class="bg-white rounded p-8 w-1/3">
            <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Nom:</label>
                <input v-model="form.name" type="text" id="name" name="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description:</label>
                <textarea v-model="form.description" id="description" name="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="price">Prix:</label>
                <input v-model.number="form.price" type="number" id="price" name="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="category">Catégorie:</label>
                <input v-model="form.category" type="text" id="category" name="category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="image">Image URL:</label>
                <input v-model="form.image" type="text" id="image" name="image" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="flex justify-end">
                <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
                <button @click="closeModal" type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
