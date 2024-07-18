<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import CrudUser from '../../services/UserService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';

import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';

const pageTitle = ref('Profil Utilisateur');
const store = useStore();
const showEditForm = ref(false);

const editUserNewData = ref({
  id:store.state.user.id,
  firstName: store.state.user.firstName,
  lastName: store.state.user.lastName,
  email: store.state.user.email,
  phone: store.state.user.phone,
  password: '',
  address: store.state.user.address,
  role: store.state.user.role,
  token:store.state.token
});
console.log(store.state.token);
const ErrorsUpdateUser = ref('');
const showSuccessAlertUpdate = ref(false);

const saveUser = async () => {
  try {
 await CrudUser.updateUser(store.state.user.id, editUserNewData.value);
    showSuccessAlertUpdate.value = true;
    setTimeout(() => {
      showSuccessAlertUpdate.value = false;
    }, 3000);
    store.dispatch('setUser', editUserNewData.value);
    cancelEdit();
  } catch (error) {
    ErrorsUpdateUser.value = error.response.data;
  }
};

const cancelEdit = () => {
  showEditForm.value = false;
  ErrorsUpdateUser.value = '';
};
</script>


<template>
    <DefaultLayout>
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <AlertSuccess v-if="showSuccessAlertUpdate" :message="'Utilisateur modifié avec succès'" class="absolute top-8 left-[40rem] !w-[500px]"/>
  
      <div v-if="showEditForm" class="overlay"></div>
  
      <div v-if="showEditForm" class="absolute z-40 top-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
        <DefaultCard cardTitle="Modifier le profil">
          <span class="text-xs text-red mt-2 ml-8">{{ ErrorsUpdateUser }}</span>
  
          <form @submit.prevent="saveUser">
            <div class="p-2">
              <div class="mb-4 flex flex-col gap-6 xl:flex-row">
                <InputGroup
                  label="Nom"
                  type="text"
                  :value="editUserNewData.firstName"
                  @input="editUserNewData.firstName = $event.target.value"
                  customClasses="w-full xl:w-1/2"
                />
                <InputGroup
                  label="Prénom"
                  type="text"
                  :value="editUserNewData.lastName"
                  @input="editUserNewData.lastName = $event.target.value"
                  customClasses="w-full xl:w-1/2"
                />
              </div>
              <div class="mb-4 flex flex-col gap-6 xl:flex-row">
                <InputGroup
                  label="Email"
                  type="email"
                  :value="editUserNewData.email"
                  @input="editUserNewData.email = $event.target.value"
                  customClasses="w-full xl:w-1/2"
                  required
                />
                <InputGroup
                  label="Mot de passe"
                  type="password"
                  :value="editUserNewData.password"
                  @input="editUserNewData.password = $event.target.value"
                  placeholder="Entrez le nouveau mot de passe"
                  customClasses="w-full xl:w-1/2"
                  required
                />
              </div>
              <div class="mb-4 flex flex-col gap-6 xl:flex-row">
                <InputGroup
                  label="Téléphone"
                  type="text"
                  :value="editUserNewData.phone"
                  @input="editUserNewData.phone = $event.target.value"
                  customClasses="w-full xl:w-1/2"
                  required
                />
                <InputGroup
                  label="Adresse"
                  type="text"
                  :value="editUserNewData.address"
                  @input="editUserNewData.address = $event.target.value"
                  customClasses="w-full xl:w-1/2"
                  required
                />
              </div>
              <div class="flex justify-around items-center">
                <button
                  type="submit"
                  class="flex w-full justify-center rounded bg-[#D8B775] p-3 font-medium m-1 text-white hover:bg-opacity-90"
                >
                  Enregistrer
                </button>
                <button
                  @click="cancelEdit"
                  class="flex w-full justify-center rounded bg-red p-3 m-1 font-medium text-white hover:bg-opacity-90"
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </DefaultCard>
      </div>
  
      <div class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default">
        <div class="relative h-65 md:h-80">
          <video
            src="../../assets/video profil .mp4"
            controls
            autoplay
            class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          ></video>
        </div>
        <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div class="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div class="relative drop-shadow-2">
              <img src="../../assets/photo.png" alt="photo de profil" class="rounded-full" />
              <label
                for="profile"
                class="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <svg
                  class="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                    fill="white"
                  />
                </svg>
              </label>
            </div>
          </div>
  
          <h1 class="text-2xl sm:text-3xl font-medium text-gray-900 mt-3">
            {{ store.state.user.firstName }} {{ store.state.user.lastName }}
          </h1>
          <p class="text-base text-gray-3 mt-1">{{ store.state.user.role }}</p>
        </div>
        <div class="mt-4.5 mb-5.5 grid grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 mx-10">
          <div class="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 xsm:flex-row">
            <span class="font-semibold text-black">Adresse</span>
            <span class="text-sm">{{ store.state.user.address }}</span>
          </div>
          <div class="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 xsm:flex-row">
            <span class="font-semibold text-black">Téléphone</span>
            <span class="text-sm">{{ store.state.user.phone }}</span>
          </div>
          <div class="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
            <span class="font-semibold text-black">Email</span>
            <span class="text-sm">{{ store.state.user.email }}</span>
          </div>
        </div>
  
        <div class="flex justify-end items-center px-4 py-3 bg-gray-50">
          <ButtonDefault label="Modifier le profil" customClasses="bg-[#D8B775] text-white rounded-md" @click="showEditForm = true"/>
        </div>
      </div>
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

