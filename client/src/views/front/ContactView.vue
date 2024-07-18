<script setup>
import { reactive, ref } from 'vue';
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue';
import DefaultContactCard from '../../components/front/Authentification/DefaultContactCard.vue';
import InputGroup from '../../components/front/Authentification/InputGroup.vue';
import ContactService from '../../services/ContactService';
import { z, ZodError } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  email: z.string().min(1, 'L\'email est requis').email('L\'email n\'est pas valide'),
  message: z.string().min(1, 'Le message est requis'),
  subject: z.string().min(1, 'Le sujet est requis')
});

const form = reactive({
  name: '',
  firstName: '',
  email: '',
  message: '',
  subject: ''
});

const errors = reactive({
  name: '',
  firstName: '',
  email: '',
  message: '',
  subject: ''
});

const successMessage = ref('');

const handleInput = (key, value) => {
  form[key] = value;
  errors[key] = '';
};

const validateForm = () => {
  try {
    formSchema.parse(form);
    return true;
  } catch (err) {
    if (err instanceof ZodError) {
      err.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      await ContactService.sendContactForm(form);
      successMessage.value = 'Message envoyé avec succès !';
      Object.keys(form).forEach(key => form[key] = '');
    } catch (error) {
      alert('Erreur lors de l\'envoi du message.');
    }
  }
};
</script>

<template>
  <DefaultLayout>
    <DefaultContactCard subtitle="E-parfums" title="Contactez-Nous">
      <form @submit.prevent="handleSubmit">
        <InputGroup label="Nom" type="text" :value="form.name" @input="handleInput('name', $event.target.value)">
          <svg class="fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: #9B9B9B;">
            <path d="m28 6v20h-24v-20zm0-2h-24a2 2 0 0 0 -2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-20a2 2 0 0 0 -2-2z" />
            <path d="m6 10h7v2h-7z" />
            <path d="m6 14h4v2h-4z" />
            <path d="m23 18h-6a3 3 0 0 0 -3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0 -3-3z" />
            <path d="m20 17a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
            <path d="m0 0h32v32h-32z" fill="none" />
          </svg>
        </InputGroup>
        <div v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</div>
        
        <InputGroup label="Prénom" type="text" :value="form.firstName" @input="handleInput('firstName', $event.target.value)">
          <svg class="fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: #9B9B9B;">
            <path d="m28 6v20h-24v-20zm0-2h-24a2 2 0 0 0 -2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-20a2 2 0 0 0 -2-2z" />
            <path d="m6 10h7v2h-7z" />
            <path d="m6 14h4v2h-4z" />
            <path d="m23 18h-6a3 3 0 0 0 -3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0 -3-3z" />
            <path d="m20 17a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
            <path d="m0 0h32v32h-32z" fill="none" />
          </svg>
        </InputGroup>
        <div v-if="errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</div>

        <InputGroup label="Email" type="email" :value="form.email" @input="handleInput('email', $event.target.value)">
          <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5">
              <path d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z" fill="" />
            </g>
          </svg>
        </InputGroup>
        <div v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</div>

        <div>
          <label class="mb-3 block text-sm font-medium text-black dark:text-white">
            Sujet du message
          </label>
          <div class="relative z-20 bg-white dark:bg-form-input">
            <span class="absolute top-1/2 left-4 z-30 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                    fill="#637381"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                    fill="#637381"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
            <select
              v-model="form.subject"
              @input="handleInput('subject', $event.target.value)"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="" disabled>Sélectionner un sujet</option>
              <option value="Question générale" class="text-body dark:text-bodydark">Question générale</option>
              <option value="Support technique" class="text-body dark:text-bodydark">Support technique</option>
              <option value="Demande de partenariat" class="text-body dark:text-bodydark">Demande de partenariat</option>
              <option value="Autre" class="text-body dark:text-bodydark">Autre</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div v-if="errors.subject" class="text-red-500 text-sm">{{ errors.subject }}</div>

        <InputGroup label="Message" type="textarea" :value="form.message" @input="handleInput('message', $event.target.value)">
          <svg class="fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: #9B9B9B;">
            <path d="m28 6v20h-24v-20zm0-2h-24a2 2 0 0 0 -2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-20a2 2 0 0 0 -2-2z" />
            <path d="m6 10h7v2h-7z" />
            <path d="m6 14h4v2h-4z" />
            <path d="m23 18h-6a3 3 0 0 0 -3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0 -3-3z" />
            <path d="m20 17a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
            <path d="m0 0h32v32h-32z" fill="none" />
          </svg>
        </InputGroup>
        <div v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</div>

        <div class="mb-5 mt-6">
          <input type="submit" value="Envoyer" class="w-full cursor-pointer rounded-lg border border-primary bg-[#C58940] p-4 font-medium text-white transition hover:bg-opacity-90" />
        </div>
        <div v-if="successMessage" class="text-green-500 text-sm">{{ successMessage }}</div>
      </form>
    </DefaultContactCard>
  </DefaultLayout>
</template>

<style scoped>
/* Ajoutez votre style ici */
</style>
