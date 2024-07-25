<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import BreadcrumbDefault from '../../components/back/componentsGeneric/Breadcrumbs/BreadcrumbDefault.vue';
import CrudUser from '../../services/UserService';
import OrderService from '../../services/OrderService';
import AlertSuccess from '../../components/back/componentsGeneric/Alerts/AlertSuccess.vue';
import ButtonDefault from '../../components/back/componentsGeneric/Buttons/ButtonDefault.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import DefaultCard from '../../components/back/componentsGeneric/Forms/DefaultCard.vue';
import ConfirmationPopup from '../../components/back/componentsGeneric/Popup/ConfirmationPopup.vue';
import { useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../assets/PARFUMS.png'; 

const router = useRouter();
const store = useStore();
const pageTitle = ref('Profil Utilisateur');
const showEditForm = ref(false);
const userToDelete = ref(null);
const showSuccessAlertDelete = ref(false);
const showConfirmationPopup = ref(false);
const userOrders = ref([]); // Stocker les commandes de l'utilisateur

const editUserNewData = ref({
  id: store.state.user.id,
  firstName: store.state.user.firstName,
  lastName: store.state.user.lastName,
  email: store.state.user.email,
  phone: store.state.user.phone,
  password: '',
  address: store.state.user.address,
  role: store.state.user.role,
  token: store.state.token
});

const ErrorsUpdateUser = ref('');
const showSuccessAlertUpdate = ref(false);

const companyInfo = {
  name: 'Parfums Entreprise',
  address: '242 rue Fbg St Antoine, Paris, France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@parfums.com'
};

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
    ErrorsUpdateUser.value = error.response?.data || 'Une erreur est survenue';
  }
};

const cancelEdit = () => {
  showEditForm.value = false;
  ErrorsUpdateUser.value = '';
};

const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showConfirmationPopup.value = true;
};

const deleteUser = async () => {
  try {
    if (userToDelete.value) {
      await CrudUser.deleteUser(userToDelete.value.id, store.state.user.role, store.state.token);
      showSuccessAlertDelete.value = true;
      setTimeout(() => {
        showSuccessAlertDelete.value = false;
      }, 3000);
      showConfirmationPopup.value = false;
    }
    router.push('/connexion');
    await store.dispatch('resetUser');
  } catch (error) {
    ErrorsUpdateUser.value = error.response?.data || 'Une erreur est survenue';
  }
};

const cancelDelete = () => {
  showConfirmationPopup.value = false;
};
const showForm = () => {
  showEditForm.value = true;
}
const downloadUserInfoPDF = async () => {
  const doc = new jsPDF();
  const user = store.state.user;
  const bgColor = '#D8B775';
  doc.setFillColor(bgColor);
  doc.rect(10, 0, 190, 20, 'F'); 


  doc.setFontSize(18);
  doc.setTextColor('#fff');
  doc.text('Informations Personnelles', 70, 10); 
  
  
  doc.addImage(logo, 'PNG', 10, 25, 50, 50);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Entreprise: ${companyInfo.name}`, 10, 65);
  doc.text(`Adresse: ${companyInfo.address}`, 10, 70);
  doc.text(`Téléphone: ${companyInfo.phone}`, 10, 75);
  doc.text(`Email: ${companyInfo.email}`, 10, 80);

 

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Nom: ${user.firstName}`, 135, 65);
  doc.text(`Prénom: ${user.lastName}`, 135, 70);
  doc.text(`Email: ${user.email}`, 135, 75);
  doc.text(`Téléphone: ${user.phone}`, 135, 80);
  doc.text(`Adresse: ${user.address}`, 135, 85);

  const orders = userOrders.value;
  doc.setFontSize(16);
  doc.setTextColor('#D8B775');
  doc.text('Mes commandes', 85,120); 

  if (orders.length > 0) {
    doc.autoTable({
      startY:125,
      head: [['ID Commande', 'Statut Livraison', 'Statut Paiement', 'Total', 'Date Commande']],
      body: orders.map(order => [
        order.orderId,
        order.deliveryStatus,
        order.paymentStatus,
        order.total,
        order.dateOrder
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 160 }
    });
  } else {
    doc.text('Aucune commande trouvée.', 70, 160);
  }

  doc.save('informations_personnelles.pdf');
};


const fetchUserOrders = async () => {
  try {
    const response = await OrderService.getOrderByUser(store.state.user.id);
    console.log(response.formattedOrders)
    userOrders.value = response.formattedOrders;

  } catch (error) {
    console.error('Error fetching user orders:', error);
  }
};

onMounted(() => {
  fetchUserOrders();
});
</script>


<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" linkText="Accueil" linkTo="/" />
    <AlertSuccess v-if="showSuccessAlertUpdate" :message="'Utilisateur modifié avec succès'" class="absolute top-8 left-[40rem] !w-[500px]" />
    <AlertSuccess v-if="showSuccessAlertDelete" :message="'Utilisateur supprimé avec succès'" />

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
        <img
          src="../../assets/cover-01.png"
          alt="Cover Image"
          class="h-full w-full rounded-tl-sm rounded-tr-sm object-center"
        />
      </div>
      <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div class="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
          <div class="relative drop-shadow-2">
            <img src="../../assets/photo.png" alt="photo de profil" class="rounded-full" />
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
      <ConfirmationPopup 
        :isVisible="showConfirmationPopup"
        message="Êtes-vous sûr de vouloir supprimer votre compte ?"
        @confirm="deleteUser"
        @cancel="cancelDelete"
        class="z-99"
      />
      <div class="flex justify-around items-center px-4 py-3 bg-gray-50">
        <ButtonDefault label="Modifier le profil" customClasses="bg-[#D8B775] text-white rounded-md" @click="showForm()"/>

        <ButtonDefault v-if="store.state.user.role !== 'ADMIN'" label="Supprimer le profil" customClasses="bg-red text-white rounded-md" @click="confirmDeleteUser(store.state.user)"/>
        <ButtonDefault v-if="store.state.user.role === 'USER'" label="Télécharger PDF" customClasses="bg-[#D8B775] text-white rounded-md" @click="downloadUserInfoPDF()"/>
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



