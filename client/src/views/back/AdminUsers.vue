<script setup lang="ts">
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import ButtonDefault from '@/components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import BreadcrumbDefault from '@/components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import { ref, onMounted } from 'vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import SelectGroupTwo from '../../components/back/componentsGeneric/Forms/SelectGroup/SelectGroupTwo.vue';
import DataTable from '../../components/back/componentsGeneric/DataTable.vue';
import CrudUser from '../../services/UserService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import ConfirmationPopup from '../../components/back/componentsGeneric/Popup/ConfirmationPopup.vue';
const headers = ['Email', 'Nom', 'Prénom', 'Téléphone', 'Adresse', 'Role'];
const users = ref([]);
const showEditForm = ref(false);
const editedUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  address: '',
  role: ''
});
const editUserNewData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  address: '',
  role: ''
});
const NewUser = ref({
  firstName: '',
  lastName: '',
  password: '',
  address: '',
  email: '',
  phone: '',
  role: ''
});

const Errors = ref<string>();
  const ErrorsUpdateUser = ref<string>();

const showSuccessAlert = ref(false);
const showSuccessAlertdelete = ref(false);
const showSuccessAlertUpdate = ref(false);


const showConfirmationPopup = ref(false);
const userToDelete = ref(null);

const loadUsers = async () => {
  try {
    const response = await CrudUser.getUsers();
    users.value = response.data; 
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  }
};

onMounted(loadUsers);

const pageTitle = ref('Utilisateurs');
const showForm = ref(false);

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (showForm.value) {
    Errors.value = ''; // Reset errors when opening the form
  }
};

// Méthode pour afficher le formulaire d'édition de l'utilisateur
const editUser = (row) => {
  editedUser.value = {
    id: row.id,
    firstName: row.nom, 
    lastName: row.prénom,
    email: row.email,
    phone: row.téléphone,
    address: row.adresse,
    role: row.role
  };
  editUserNewData.value = { ...editedUser.value }; 
  showEditForm.value = true;
};

// Méthode pour enregistrer les modifications de l'utilisateur
const saveUser = async () => {
  try {
      
    await CrudUser.updateUser(editedUser.value.id, editUserNewData.value);
    await loadUsers();
    showSuccessAlertUpdate.value = true;
    setTimeout(() => {
      showSuccessAlertUpdate.value = false;
    }, 3000);
    ErrorsUpdateUser.value='';
    cancelEdit();
  } catch (error) {
    ErrorsUpdateUser.value=error.response.data; 
  }
};

// Méthode pour annuler l'édition de l'utilisateur
const cancelEdit = () => {
  editedUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: ''
  };
  showEditForm.value = false;
  ErrorsUpdateUser.value='';
};

const createUser = async () => {
  Errors.value = ''; // Reset errors before submitting
  try {
    await CrudUser.createUser(NewUser.value);
    await loadUsers();
    showSuccessAlert.value = true;
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
    showForm.value = false; 
  } catch (error) {
    Errors.value = error.response.data;
  }
};

// Afficher la popup de confirmation avant de supprimer un utilisateur
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showConfirmationPopup.value = true;
};

// Méthode pour supprimer un utilisateur
const deleteUser = async () => {
  try {
    await CrudUser.deleteUser(userToDelete.value.id);
    await loadUsers();
    showSuccessAlertdelete.value = true;
    setTimeout(() => {
      showSuccessAlertdelete.value = false;
    }, 3000);
    showConfirmationPopup.value = false;
  } catch (error) {
    Errors.value = error.response.data;
  }
};

const cancelDelete = () => {
  showConfirmationPopup.value = false;
};
</script>

<template>
  <DefaultLayout>
    <div class="absolute top-17 left-150 w-125">
      <AlertSuccess v-if="showSuccessAlert" :message="'Utilisateur enregistré avec succès'" />
      <AlertSuccess v-if="showSuccessAlertdelete" :message="'Utilisateur supprimé avec succès'" />
      <AlertSuccess v-if="showSuccessAlertUpdate" :message="'Utilisateur modifié avec succès'" />

    </div>
    <div v-if="showForm || showEditForm" class="overlay"></div>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="flex justify-end py-1 px-5">
      <ButtonDefault @click="toggleForm" label="Ajouter un utilisateur" customClasses="bg-[#D8B775] text-white rounded-md">
        <span>
          <svg class="fill-current" height="22px" width="22px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 492.308 492.308" xml:space="preserve">
            <g>
              <g>
                <polygon points="401.817,367.952 401.817,322.308 382.125,322.308 382.125,367.952 336.481,367.952 336.481,387.644 
                  382.125,387.644 382.125,433.279 401.817,433.279 401.817,387.644 447.462,387.644 447.462,367.952"/>
              </g>
            </g>
            <g>
              <g>
                <path d="M392.15,277.471c-14.551-19.507-31.998-36.447-52.15-50.144c-1.615-1.106-4.875-3.221-4.875-3.221L327.26,219
                  l-5.481,7.615c-24.096,33.452-63.01,53.433-104.077,53.433c-41.077,0-79.981-19.981-104.077-53.442l-5.5-7.644l-11.904,7.817
                  C35.971,267.356,0,334.904,0,407.462v31.644h312.725c18.37,23.685,47.018,39.019,79.246,39.019
                  c55.327,0,100.337-45.01,100.337-100.327C492.308,322.531,447.394,277.569,392.15,277.471z M19.692,419.414v-11.952
                  c0-64.481,31.231-124.615,83.788-161.769c28,34.01,70.019,54.048,114.221,54.048c44.202,0,86.221-20.038,114.221-54.048
                  c18.048,12.481,34.615,27.952,49.308,45.596c-17.625,10.327-33.327,23.577-46.846,38.894c-20.413,23.471-35.452,50.857-44.048,80.827
                  H19.692z M391.971,458.433c-44.079,0-80.077-35.998-80.077-80.096s35.998-80.096,80.077-80.096s80.096,35.998,80.096,80.096
                  S436.059,458.433,391.971,458.433z"/>
                <path d="M141.375,189.24c19.875,26.981,51.231,43.317,84.981,43.317c33.75,0,65.096-16.336,84.981-43.317
                  c17.385-23.615,26.654-51.836,26.654-81.519C337.981,48.702,289.279,0,228.596,0S119.192,48.702,119.192,107.721
                  C119.192,137.404,128.462,165.625,141.375,189.24z M228.596,19.683c48.462,0,87.981,39.519,87.981,88.038
                  s-39.519,88.038-87.981,88.038s-88.038-39.519-88.038-88.038S180.134,19.683,228.596,19.683z"/>
              </g>
            </g>
          </svg>
        </span>
      </ButtonDefault>
    </div>

    <div v-if="showForm" class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white shadow z-40">
      <DefaultCard cardTitle="Ajouter un utilisateur">
        <span  class=" text-xs text-red mt-2 ml-8">{{ Errors }}</span>

        <form @submit.prevent="createUser">
          <div class="p-2">
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                @input="NewUser.firstName=$event.target.value"
                placeholder="Moussa"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
              <InputGroup
                label="Prénom"
                type="text"
                @input="NewUser.lastName=$event.target.value"
                placeholder="Camara"
                customClasses="w-full xl:w-1/2"
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Adresse"
                type="text"
                @input="NewUser.address=$event.target.value"
                placeholder="22 rue Toinville paris 75000"
                customClasses="mb-2"
                required
                :isRequired="true"
              />
              <InputGroup
                label="Email"
                type="email"
                @input="NewUser.email=$event.target.value"
                placeholder="exemple@gmail.com"
                customClasses="mb-2"
                required
                :isRequired="true"
              />
            </div>
            <div class="flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Mot de passe"
                type="password"
                @input="NewUser.password=$event.target.value"
                placeholder="Enter le mot de passe"
                customClasses="mb-2"
                required
                :isRequired="true"
              />
              <InputGroup
                label="Téléphone"
                type="text"
                @input="NewUser.phone=$event.target.value"
                placeholder="0751865113"
                customClasses="mb-2"
                required
                :isRequired="true"
              />
            </div>
            <SelectGroupTwo @input="NewUser.role=$event.target.value" />
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
      <DefaultCard cardTitle="Modifier un utilisateur">
        <span  class=" text-xs text-red mt-2 ml-8">{{   ErrorsUpdateUser }}</span>

      
        <form @submit.prevent="saveUser">
          <div class="p-2">
            <div class="mb-4 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Nom"
                type="text"
                :value="editedUser.firstName"
                @input="editUserNewData.firstName=$event.target.value"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Prénom"
                type="text"
                :value="editedUser.lastName"
                @input="editUserNewData.lastName=$event.target.value"
                customClasses="w-full xl:w-1/2"
              />
            </div>
            <div class="mb-4 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Email"
                type="email"
                :value="editedUser.email"
                @input="editUserNewData.email=$event.target.value"
                customClasses="w-full xl:w-1/2"
                required
              />
              <InputGroup
                label="Mot de passe"
                type="password"
                :value="editedUser.password"
                @input="editUserNewData.password=$event.target.value"
                placeholder="Enter le nouveau mot de passe"
                customClasses="w-full xl:w-1/2"
                required
              />
            </div>
            <div class="mb-4 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Téléphone"
                type="text"
                :value="editedUser.phone"
                @input="editUserNewData.phone=$event.target.value"
                customClasses="w-full xl:w-1/2"
                required
              />
              <InputGroup
                label="Adresse"
                type="text"
                :value="editedUser.address"
                @input="editUserNewData.address=$event.target.value"
                customClasses="w-full xl:w-1/2"
                required
              />
            </div>
            <SelectGroupTwo :value="editUserNewData.role" @input="editUserNewData.role=$event.target.value" />
            <div class="flex justify-around items-center">
              <button
                type="submit"
                class="flex w-full justify-center rounded bg-[#D8B775] p-3 font-medium m-1 text-gray hover:bg-opacity-90"
              >
                Enregistrer
              </button>
              <button
                @click="cancelEdit"
                class="flex w-full justify-center rounded bg-red p-3 m-1 font-medium text-gray hover:bg-opacity-90"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </DefaultCard>
    </div>
    <DataTable :headers="headers" :data="users" :filterableColumns="['Email', 'Nom', 'Prénom', 'Téléphone','Adresse','Role']" :editUser="editUser" :deleteUser="confirmDeleteUser" />

    <ConfirmationPopup 
      :isVisible="showConfirmationPopup"
      message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
      @confirm="deleteUser"
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

