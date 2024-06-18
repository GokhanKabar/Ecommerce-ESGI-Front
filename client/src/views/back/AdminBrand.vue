<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BrandService from '../../services/BrandService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import DataTable from '../../components/back/componentsGeneric/DataTable.vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import ConfirmationPopup from '../../components/back/componentsGeneric/Popup/ConfirmationPopup.vue';

const headers = ['Name'];
const brands = ref([]);
const pageTitle = 'Marques';
const newBrand = ref({
  name: ''
});
const showForm = ref(false);
const showEditForm = ref(false);
const showConfirmationPopup = ref(false);
const brandToDelete = ref(null);
const brandToEdit = ref(null);
const successMessage = ref('');
const errorMessage = ref('');

const fetchBrands = async () => {
  try {
    const response = await BrandService.getAllBrands();
    brands.value = response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
};

onMounted(async () => {
  brands.value = await BrandService.getAllBrands();
  console.log(brands.value);
})
const toggleForm = () => {
  showForm.value = !showForm.value;
  errorMessage.value = '';
};

const toggleEditForm = () => {
  showEditForm.value = !showEditForm.value;
  errorMessage.value = '';
};

const createBrand = async () => {
  console.log(newBrand.value); // Afficher la valeur actuelle pour le debug
  try {
    await BrandService.createBrand(newBrand.value);
    successMessage.value = 'Marque enregistrée avec succès';
    newBrand.value.name = '';
    fetchBrands();
    toggleForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la création de la marque';
    console.error('Error creating brand:', error);
  }
};

const editBrand = (brand) => {
  brandToEdit.value = { ...brand };
  toggleEditForm();
};

const updateBrand = async () => {
  try {
    await BrandService.updateBrand(brandToEdit.value.id, brandToEdit.value);
    successMessage.value = 'Marque mise à jour avec succès';
    fetchBrands();
    toggleEditForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de la marque';
    console.error('Error updating brand:', error);
  }
};

const confirmDeleteBrand = (brand) => {
  brandToDelete.value = brand;
  showConfirmationPopup.value = true;
};

const deleteBrand = async () => {
  try {
    await BrandService.deleteBrand(brandToDelete.value.id);
    successMessage.value = 'Marque supprimée avec succès';
    fetchBrands();
    showConfirmationPopup.value = false;
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de la marque';
    console.error('Error deleting brand:', error);
  }
};

const cancelDelete = () => {
  showConfirmationPopup.value = false;
};
</script>

<template>
  <DefaultLayout>
    <div class="absolute top-17 left-150 w-125">
      <AlertSuccess v-if="successMessage" :message="successMessage" />
    </div>
    <div v-if="showForm || showEditForm" class="overlay"></div>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="flex justify-end py-1 px-5">
      <ButtonDefault @click="toggleForm" label="Ajouter une marque" customClasses="bg-[#D8B775] text-white rounded-md">
      </ButtonDefault>
    </div>

    <div v-if="showForm" class="absolute z-1 top-6 left-1/2 transform -translate-x-1/2">
      <DefaultCard cardTitle="Ajouter une marque">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>

        <form @submit.prevent="createBrand">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                v-model="newBrand.name"
                placeholder="Marque"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex justify-around items-center">
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
      <DefaultCard cardTitle="Modifier une marque">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>

        <form @submit.prevent="updateBrand">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                v-model="brandToEdit.name"
                placeholder="Marque"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex justify-around items-center">
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

    <DataTable :headers="headers" :data="brands" :filterableColumns="['Name']" :editUser="editBrand" :deleteUser="confirmDeleteBrand" />

    <ConfirmationPopup 
      :isVisible="showConfirmationPopup"
      message="Êtes-vous sûr de vouloir supprimer cette marque ?"
      @confirm="deleteBrand"
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
