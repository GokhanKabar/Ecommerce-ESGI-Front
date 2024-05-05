<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import DefaultAuthCard from '@/components/front/Authentification/DefaultAuthCard.vue'
import InputGroup from '@/components/front/Authentification/InputGroup.vue'
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue'
import AuthenticationService from '@/services/AuthenticationService';
import { ref } from 'vue';
const email = ref('');
const SendEmailRestpassword = async () => {
  try {
    const response = await AuthenticationService.forgotPassword({
      email: email.value,
    });
    router.push('/confirmation-email-reset-password')
  } catch (error) {
    console.error("Erreur de connexion:", error);
  }
};
</script>

<template>
  <DefaultLayout>

    <DefaultAuthCard subtitle="E-parfums" title="Rénitialiser le mot de passe">
      <InputGroup label="Email" type="email" placeholder="Enter your email" :value="email"
        @input="email = $event.target.value">
        <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path
              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
              fill="" />
          </g>
        </svg>
      </InputGroup>

      <div class="mb-5 mt-6">
        <input type="submit" @click="SendEmailRestpassword" value="Rénitialiser le mot de passe"
          class="w-full cursor-pointer rounded-lg border border-primary bg-[#C58940] p-4 font-medium text-white transition hover:bg-opacity-90" />
      </div>
      <p class="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
            <a class="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-[#C58940] dark:text-gray-500 dark:hover:text-gray-200" href="#" target="_blank">
             <img src="https://i.goopics.net/zb0v4k.png" class="w-8">
               Parfums
            </a>
            <router-link to="/connexion" class="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-[#C58940] dark:text-gray-500 dark:hover:text-gray-200" href="/contact">

                Contactez-nous !
            </router-link> </p>
    </DefaultAuthCard>
  </DefaultLayout>
</template>
