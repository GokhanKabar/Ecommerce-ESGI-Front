<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService';
import FamilyService from '../../services/FamilyService';
import { useStore } from 'vuex';

const store = useStore();

const newProduct = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  concentration: '',
  promotion: false,
  image: null,
  brandId: null,
  familyId: null,
});
const products = ref([]);
const brands = ref([]);
const families = ref([]);
const isAdmin = computed(() => store.state.user && store.state.user.role === 'ADMIN');

const fetchProducts = async () => {
  try {
    const response = await ProductService.getProductsAdmin();
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchBrandsAndFamilies = async () => {
  try {
    const [brandsResponse, familiesResponse] = await Promise.all([
      BrandService.getAllBrands(),
      FamilyService.getAllFamilies(),
    ]);
    brands.value = brandsResponse.data;
    families.value = familiesResponse.data;
  } catch (error) {
    console.error('Error fetching brands and families:', error);
  }
};

const submitForm = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }

    const formData = new FormData();
    for (const key in newProduct.value) {
      formData.append(key, newProduct.value[key]);
    }

    await ProductService.createProduct(formData);
    resetForm();
    fetchProducts();
  } catch (error) {
    console.error('Error creating product:', error);
  }
};

const removeProduct = async (id: number) => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await ProductService.deleteProduct(id);
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

const resetForm = () => {
  newProduct.value = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    concentration: '',
    promotion: false,
    image: null,
    brandId: null,
    familyId: null,
  };
};

onMounted(() => {
  fetchProducts();
  fetchBrandsAndFamilies();
});
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-6">Gestion des produits</h1>
      <div v-if="isAdmin" class="mb-10">
        <h2 class="text-2xl font-medium text-gray-800 mb-4">Création d'un produit</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="productName" class="block text-sm font-medium text-gray-700">Nom du produit</label>
            <input
              id="productName"
              v-model="newProduct.name"
              type="text"
              placeholder="Entrez le nom du produit"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="productDescription" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="productDescription"
              v-model="newProduct.description"
              placeholder="Entrez la description du produit"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="productCategory" class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              id="productCategory"
              v-model="newProduct.category"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="" disabled selected>Choisissez une catégorie</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <div>
            <label for="productPrice" class="block text-sm font-medium text-gray-700">Prix</label>
            <input
              id="productPrice"
              v-model="newProduct.price"
              type="number"
              step="0.01"
              placeholder="Entrez le prix du produit"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="productStock" class="block text-sm font-medium text-gray-700">Stock</label>
            <input
              id="productStock"
              v-model="newProduct.stock"
              type="number"
              placeholder="Entrez la quantité en stock"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="productConcentration" class="block text-sm font-medium text-gray-700">Concentration</label>
            <select
              id="productConcentration"
              v-model="newProduct.concentration"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="" disabled selected>Choisissez une concentration</option>
              <option value="Eau de Toilette">Eau de Toilette</option>
              <option value="Eau de Parfum">Eau de Parfum</option>
              <option value="Extrait de parfum">Extrait de parfum</option>
            </select>
          </div>
          <div>
            <label for="productPromotion" class="block text-sm font-medium text-gray-700">Promotion</label>
            <input
              id="productPromotion"
              v-model="newProduct.promotion"
              type="checkbox"
              class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="productImage" class="block text-sm font-medium text-gray-700">Image</label>
            <input
              id="productImage"
              @change="e => newProduct.image = e.target.files[0]"
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-gray-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <label for="productBrand" class="block text-sm font-medium text-gray-700">Marque</label>
            <select
              id="productBrand"
              v-model="newProduct.brandId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="" disabled selected>Choisissez une marque</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
            </select>
          </div>
          <div>
            <label for="productFamily" class="block text-sm font-medium text-gray-700">Famille</label>
            <select
              id="productFamily"
              v-model="newProduct.familyId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="" disabled selected>Choisissez une famille</option>
              <option v-for="family in families" :key="family.id" :value="family.id">{{ family.name }}</option>
            </select>
          </div>
          <div>
            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
      <div>
        <h2 class="text-2xl font-medium text-gray-800 mb-4">Liste des produits</h2>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="removeProduct(product.id)" class="text-indigo-600 hover:text-indigo-900">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
/* Ajoutez ici les styles spécifiques pour ce composant */
</style>
