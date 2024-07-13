<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService';
import FamilyService from '../../services/FamilyService';
import { useStore } from 'vuex';
import AlertSuccess from '@/components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import BreadcrumbDefault from '@/components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import DataTable from '@/components/back/componentsGeneric/DataTable.vue';
import DefaultCard from '@/components/back/componentsGeneric/Forms/DefaultCard.vue';
import InputGroup from '@/components/front/Authentification/InputGroup.vue';
import SelectGroupTwo from '@/components/back/componentsGeneric/Forms/SelectGroup/SelectGroupTwo.vue';
import ConfirmationPopup from '@/components/back/componentsGeneric/Popup/ConfirmationPopup.vue';

const store = useStore();
const headers = ['name', 'category', 'price', 'stock', 'concentration'];
const products = ref([]);
const brands = ref([]);
const families = ref([]);
const newProduct = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  concentration: '',
  promotion: 0,
  image: null,
  brandId: null,
  familyId: null,
});
const editedProduct = ref({
  id: null,
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  concentration: '',
  promotion: 0,
  image: null,
  brandId: null,
  familyId: null,
});
const showForm = ref(false);
const showEditForm = ref(false);
const showConfirmationPopup = ref(false);
const productToDelete = ref(null);
const successMessage = ref('');
const errorMessage = ref('');
const isAdmin = computed(() => store.state.user && store.state.user.role === 'ADMIN');

const fetchProducts = async () => {
  try {
    const response = await ProductService.getProductsAdmin();
    products.value = response;
  } catch (error) {
    console.error('Error fetching products:', error);
    errorMessage.value = 'Failed to fetch products.';
  }
};

const fetchBrandsAndFamilies = async () => {
  try {
    const [brandsResponse, familiesResponse] = await Promise.all([
      BrandService.getAllBrandsAdmin(),
      FamilyService.getAllFamiliesAdmin(),
    ]);
    brands.value = brandsResponse;
    families.value = familiesResponse;
  } catch (error) {
    console.error('Error fetching brands and families:', error);
  }
};

onMounted(async () => {
  await fetchProducts();
  await fetchBrandsAndFamilies();
});

const toggleForm = () => {
  showForm.value = !showForm.value;
  errorMessage.value = '';
};

const toggleEditForm = () => {
  showEditForm.value = !showEditForm.value;
  errorMessage.value = '';
};

const createProduct = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    const formData = new FormData();
    for (const key in newProduct.value) {
      formData.append(key, newProduct.value[key]);
    }
    await ProductService.createProduct(formData);
    successMessage.value = 'Produit enregistré avec succès';
    resetForm();
    await fetchProducts();
    toggleForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la création du produit';
    console.error('Error creating product:', error);
  }
};

const editProduct = (product) => {
  editedProduct.value = { ...product };
  toggleEditForm();
};

const updateProduct = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    const formData = new FormData();
    for (const key in editedProduct.value) {
      formData.append(key, editedProduct.value[key]);
    }
    await ProductService.updateProduct(editedProduct.value.id, formData);
    successMessage.value = 'Produit mis à jour avec succès';
    await fetchProducts();
    toggleEditForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour du produit';
    console.error('Error updating product:', error);
  }
};

const confirmDeleteProduct = (product) => {
  productToDelete.value = product;
  showConfirmationPopup.value = true;
};

const deleteProduct = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await ProductService.deleteProduct(productToDelete.value.id);
    successMessage.value = 'Produit supprimé avec succès';
    await fetchProducts();
    showConfirmationPopup.value = false;
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression du produit';
    console.error('Error deleting product:', error);
  }
};

const cancelDelete = () => {
  showConfirmationPopup.value = false;
};

const resetForm = () => {
  newProduct.value = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    concentration: '',
    promotion: 0,
    image: null,
    brandId: null,
    familyId: null,
  };
};
</script>

<template>
  <DefaultLayout>
    <div class="absolute top-17 left-150 w-125">
      <AlertSuccess v-if="successMessage" :message="successMessage" />
    </div>
    <div v-if="showForm || showEditForm" class="overlay"></div>
    <BreadcrumbDefault :pageTitle="'Produits'" />
    <div class="flex justify-end py-1 px-5">
      <ButtonDefault @click="toggleForm" label="Ajouter un produit" customClasses="bg-[#D8B775] text-white rounded-md">
      </ButtonDefault>
    </div>

    <div v-if="showForm" class="absolute z-1 top-6 left-1/2 transform -translate-x-1/2">
      <DefaultCard cardTitle="Ajouter un produit">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>
        <form @submit.prevent="createProduct">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                @input="newProduct.name=$event.target.value"
                placeholder="Nom du produit"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
              <InputGroup
                label="Description"
                type="text"
                @input="newProduct.description=$event.target.value"
                placeholder="Description du produit"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <div class="w-full xl:w-1/2">
                <label for="productCategory" class="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  id="productCategory"
                  v-model="newProduct.category"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une catégorie</option>
                  <option value="homme">homme</option>
                  <option value="femme">femme</option>
                </select>
              </div>
              <InputGroup
                label="Prix"
                type="number"
                @input="newProduct.price=$event.target.value"
                placeholder="Prix"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Stock"
                type="number"
                @input="newProduct.stock=$event.target.value"
                placeholder="Stock"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
              <div class="w-full xl:w-1/2">
                <label for="productConcentration" class="block text-sm font-medium text-gray-700">Concentration</label>
                <select
                  id="productConcentration"
                  @input="newProduct.concentration=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une concentration</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Extrait de parfum">Extrait de parfum</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Promotion"
                type="text"
                @input="newProduct.promotion=$event.target.value"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Image"
                type="file"
                @change="e => newProduct.image = e.target.files[0]"
                customClasses="w-full xl:w-1/2"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <div class="w-full xl:w-1/2">
                <label for="productBrand" class="block text-sm font-medium text-gray-700">Marque</label>
                <select
                  id="productBrand"
                  @input="newProduct.brandId=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une marque</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>
              <div class="w-full xl:w-1/2">
                <label for="productFamily" class="block text-sm font-medium text-gray-700">Famille</label>
                <select
                  id="productFamily"
                  @input="newProduct.familyId=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une famille</option>
                  <option v-for="family in families" :key="family.id" :value="family.id">{{ family.name }}</option>
                </select>
              </div>
            </div>
            <div class="flex justify-around items-center mt-4">
              <button
                type="submit"
                class="flex w-full justify-center rounded bg-[#D8B775] p-3 font-medium m-1 text-gray hover:bg-opacity-90"
              >
                Ajouter
              </button>
              <button @click="toggleForm" class="flex w-full justify-center rounded bg-red p-3 m-1 font-medium text-gray hover:bg-opacity-90">
                Annuler
              </button>
            </div>
          </div>
        </form>
      </DefaultCard>
    </div>

    <div v-if="showEditForm" class="absolute z-1 top-6 left-1/2 transform -translate-x-1/2">
      <DefaultCard cardTitle="Modifier un produit">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>
        <form @submit.prevent="updateProduct">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                @input="editedProduct.name=$event.target.value"
                placeholder="Nom du produit"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
              <InputGroup
                label="Description"
                type="text"
                @input="editedProduct.description=$event.target.value"
                placeholder="Description du produit"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <div class="w-full xl:w-1/2">
                <label for="editProductCategory" class="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  id="editProductCategory"
                  v-model="editedProduct.category"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une catégorie</option>
                  <option value="homme">homme</option>
                  <option value="femme">femme</option>
                </select>
              </div>
              <InputGroup
                label="Prix"
                type="number"
                @input="editedProduct.price=$event.target.value"
                placeholder="Prix"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Stock"
                type="number"
                @input="editedProduct.stock=$event.target.value"
                placeholder="Stock"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
              <div class="w-full xl:w-1/2">
                <label for="editProductConcentration" class="block text-sm font-medium text-gray-700">Concentration</label>
                <select
                  id="editProductConcentration"
                  @input="editedProduct.concentration=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une concentration</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Extrait de parfum">Extrait de parfum</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Promotion"
                type="text"
                @input="editedProduct.promotion=$event.target.value"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Image"
                type="file"
                @change="e => editedProduct.image = e.target.files[0]"
                customClasses="w-full xl:w-1/2"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <div class="w-full xl:w-1/2">
                <label for="editProductBrand" class="block text-sm font-medium text-gray-700">Marque</label>
                <select
                  id="editProductBrand"
                  @input="editedProduct.brandId=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une marque</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>
              <div class="w-full xl:w-1/2">
                <label for="editProductFamily" class="block text-sm font-medium text-gray-700">Famille</label>
                <select
                  id="editProductFamily"
                  @input="editedProduct.familyId=$event.target.value"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="" disabled selected>Choisissez une famille</option>
                  <option v-for="family in families" :key="family.id" :value="family.id">{{ family.name }}</option>
                </select>
              </div>
            </div>
            <div class="flex justify-around items-center mt-4">
              <button
                type="submit"
                class="flex w-full justify-center rounded bg-[#D8B775] p-3 font-medium m-1 text-gray hover:bg-opacity-90"
              >
                Mettre à jour
              </button>
              <button @click="toggleEditForm" class="flex w-full justify-center rounded bg-red p-3 m-1 font-medium text-gray hover:bg-opacity-90">
                Annuler
              </button>
            </div>
          </div>
        </form>
      </DefaultCard>
    </div>

    <DataTable :headers="headers" :data="products" :filterableColumns="headers" :editUser="editProduct" :deleteUser="confirmDeleteProduct" />

    <ConfirmationPopup 
      :isVisible="showConfirmationPopup"
      message="Êtes-vous sûr de vouloir supprimer ce produit ?"
      @confirm="deleteProduct"
      @cancel="cancelDelete"
    />
  </DefaultLayout>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  pointer-events: auto; 
}
</style>
