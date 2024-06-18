<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import FamilyService from '../../services/FamilyService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import DataTable from '../../components/back/componentsGeneric/DataTable.vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import ConfirmationPopup from '../../components/back/componentsGeneric/Popup/ConfirmationPopup.vue';
import { useStore } from 'vuex';

const store = useStore();

const headers = ['Name'];
const families = ref([]);
const newFamily = ref({ name: '' });
const familyToEdit = ref({ id: null, name: '' });
const familyToDelete = ref(null);
const showForm = ref(false);
const showEditForm = ref(false);
const showConfirmationPopup = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const isAdmin = computed(() => store.state.user && store.state.user.role === 'ADMIN');

const fetchFamilies = async () => {
  try {
    const response = await FamilyService.getAllFamilies();
    families.value = response.data;
  } catch (error) {
    console.error('Error fetching families:', error);
  }
};

onMounted(async () => {
  families.value = await FamilyService.getAllFamilies();
})

const toggleForm = () => {
  showForm.value = !showForm.value;
  errorMessage.value = '';
};

const toggleEditForm = () => {
  showEditForm.value = !showEditForm.value;
  errorMessage.value = '';
};

const createFamily = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await FamilyService.createFamily(newFamily.value);
    successMessage.value = 'Famille enregistrée avec succès';
    newFamily.value.name = '';
    fetchFamilies();
    toggleForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la création de la famille';
    console.error('Error creating family:', error);
  }
};

const editFamily = (family) => {
  familyToEdit.value = { ...family };
  toggleEditForm();
};

const updateFamily = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await FamilyService.updateFamily(familyToEdit.value.id, familyToEdit.value);
    successMessage.value = 'Famille mise à jour avec succès';
    fetchFamilies();
    toggleEditForm();
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de la famille';
    console.error('Error updating family:', error);
  }
};

const confirmDeleteFamily = (family) => {
  familyToDelete.value = family;
  showConfirmationPopup.value = true;
};

const deleteFamily = async () => {
  try {
    if (!isAdmin.value) {
      throw new Error('Unauthorized');
    }
    await FamilyService.deleteFamily(familyToDelete.value.id);
    successMessage.value = 'Famille supprimée avec succès';
    fetchFamilies();
    showConfirmationPopup.value = false;
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de la famille';
    console.error('Error deleting family:', error);
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
    <BreadcrumbDefault :pageTitle="'Familles'" />
    <div class="flex justify-end py-1 px-5">
      <ButtonDefault @click="toggleForm" label="Ajouter une famille" customClasses="bg-[#D8B775] text-white rounded-md">
      </ButtonDefault>
    </div>

    <div v-if="showForm" class="absolute z-1 top-6 left-1/2 transform -translate-x-1/2">
      <DefaultCard cardTitle="Ajouter une famille">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>

        <form @submit.prevent="createFamily">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                v-model="newFamily.name"
                placeholder="Famille"
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
      <DefaultCard cardTitle="Modifier une famille">
        <span class="text-xs text-red mt-2 ml-8">{{ errorMessage }}</span>

        <form @submit.prevent="updateFamily">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                v-model="familyToEdit.name"
                placeholder="Famille"
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

    <DataTable :headers="headers" :data="families" :filterableColumns="['Name']" :editUser="editFamily" :deleteUser="confirmDeleteFamily" />

    <ConfirmationPopup 
      :isVisible="showConfirmationPopup"
      message="Êtes-vous sûr de vouloir supprimer cette famille ?"
      @confirm="deleteFamily"
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
