<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import FamilyService from '../../services/FamilyService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import DataTable from '../../components/back/componentsGeneric/DataTable.vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import ConfirmationPopup from '../../components/back/componentsGeneric/Popup/ConfirmationPopup.vue';


const headers = ['name'];
const families = ref([]);
const newFamily = ref({ name: '' });
const familyToEdit = ref(null);
const familyToDelete = ref(null);
const showForm = ref(false);
const showEditForm = ref(false);
const showConfirmationPopup = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const pageTitle = 'Familles';
const showSuccessAlert = ref(false);
const showSuccessAlertdelete = ref(false);
const showSuccessAlertUpdate = ref(false);

const fetchFamilies = async () => {
  try {
    const response = await FamilyService.getAllFamiliesAdmin();
    families.value = response;
  } catch (error) {
    console.error('Error fetching families:', error);
    errorMessage.value = 'Failed to fetch families.';
  }
};

onMounted(async () => {
  await fetchFamilies();
  console.log('Families:', families.value);
});


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
    await FamilyService.createFamily(newFamily.value);
    showSuccessAlert.value = true;
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
    newFamily.value.name = '';
    await fetchFamilies();
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
    console.log('Updating family with new value:', familyToEdit.value);
    await FamilyService.updateFamily(familyToEdit.value.id, familyToEdit.value);
    showSuccessAlertUpdate.value = true;
    setTimeout(() => {
      showSuccessAlertUpdate.value = false;
    }, 3000);
    await fetchFamilies();
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
    await FamilyService.deleteFamily(familyToDelete.value.id);
    showSuccessAlertdelete.value = true;
    setTimeout(() => {
      showSuccessAlertdelete.value = false;
    }, 3000);
    await fetchFamilies();
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
      <AlertSuccess v-if="showSuccessAlert" :message="'Famille enregistré avec succès'" />
      <AlertSuccess v-if="showSuccessAlertdelete" :message="'Famille supprimé avec succès'" />
      <AlertSuccess v-if="showSuccessAlertUpdate" :message="'Famille modifié avec succès'" />
    </div>
    <div v-if="showForm || showEditForm" class="overlay"></div>
    <BreadcrumbDefault :pageTitle="pageTitle" />
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
                @input="newFamily.name=$event.target.value"
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
                @input="familyToEdit.name=$event.target.value"
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

    <DataTable :headers="headers" :data="families" :filterableColumns="['name']" :editUser="editFamily" :deleteUser="confirmDeleteFamily" />

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
