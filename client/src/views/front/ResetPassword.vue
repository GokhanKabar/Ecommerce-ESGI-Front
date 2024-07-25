<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
import DefaultAuthCard from '../../components/front/Authentification/DefaultAuthCard.vue'
import InputGroup from '../../components/front/Authentification/InputGroup.vue'
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue'
import AuthenticationService from '../../services/AuthenticationService';
import { ref } from 'vue';
const password = ref('');
const repeatedPassword  = ref('');
const errorMessage = ref('');
const UpdatePassword = async () => {
    try {
        const response = await AuthenticationService.resetPassword({
            resetToken: route.query.token,
            newPassword: password.value,
            confirmPassword: repeatedPassword.value,
        });
    router.push('/connexion')
  } catch (error) {
    errorMessage.value = error.response.data;
  }
};
</script>

<template>
   <DefaultLayout>
    <DefaultAuthCard subtitle="E-parfums" title="Réinitialiser le mot de passe">
      <h1 v-html="errorMessage" class="text-red-500 text-xs"></h1>
      <InputGroup label="Mot de passe" type="password" placeholder="Entrez le nouveau mot de passe" :value="password" @input="password = $event.target.value">
        <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path
              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
              fill="" />
            <path
              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
              fill="" />
          </g>
        </svg>
      </InputGroup>
      <InputGroup label="Confirmation mot de passe" type="password" placeholder="Répétez le mot de passe" :value="repeatedPassword" @input="repeatedPassword = $event.target.value">
        <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path
              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
              fill="" />
            <path
              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
              fill="" />
          </g>
        </svg>
      </InputGroup>
      <div class="mb-5 mt-6">
        <input type="submit" @click="UpdatePassword" value="Réinitialiser le mot de passe" class="w-full cursor-pointer rounded-lg border border-primary bg-[#C58940] p-4 font-medium text-white transition hover:bg-opacity-90" />
      </div>
      <p class="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
        <a class="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-[#C58940] dark:text-gray-500 dark:hover:text-gray-200" href="#" target="_blank">
          <img src="https://i.goopics.net/zb0v4k.png" class="w-8">
          Parfums
        </a>
        <router-link to="/connexion" class="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-[#C58940] dark:text-gray-500 dark:hover:text-gray-200" href="/contact">
          Contactez-nous !
        </router-link>
      </p>
    </DefaultAuthCard>
  </DefaultLayout>
</template>
