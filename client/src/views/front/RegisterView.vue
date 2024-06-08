<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import DefaultAuthCard from '@/components/front/Authentification/DefaultAuthCard.vue';
import InputGroup from '@/components/front/Authentification/InputGroup.vue';
import DefaultLayout from '@/components/front/layouts/DefaultLayout.vue';
import AuthenticationService from '@/services/AuthenticationService';
import { ref } from 'vue';

const firstName = ref('');
const lastName = ref('');
const address = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const register = async () => {
    try {
        const response = await AuthenticationService.register({
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
        });
    
        router.push('/confirmation-email');
    } catch (error) {
        errorMessage.value = error.response.data;
    }
};
</script>


<template>
    <DefaultLayout>

        <DefaultAuthCard subtitle="E-parfums" title="Inscrivez-vous">
            <h1 v-html="errorMessage" class=" text-danger text-xs"></h1>
            <InputGroup label="Nom" type="text" placeholder="Enter votre Nom" :value="firstName"
                @input="firstName = $event.target.value" :isRequired="true">

                <svg class="fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                    style="fill: #9B9B9B;">
                    <path
                        d="m28 6v20h-24v-20zm0-2h-24a2 2 0 0 0 -2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-20a2 2 0 0 0 -2-2z" />
                    <path d="m6 10h7v2h-7z" />
                    <path d="m6 14h4v2h-4z" />
                    <path d="m23 18h-6a3 3 0 0 0 -3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0 -3-3z" />
                    <path d="m20 17a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
                    <path d="m0 0h32v32h-32z" fill="none" />
                </svg>
            </InputGroup>

            <InputGroup label="Prénom" type="text" placeholder="Enter votre Prénom" :value="lastName"
                @input="lastName = $event.target.value" :isRequired="true">
                <svg class="fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                    style="fill: #9B9B9B;">
                    <path
                        d="m28 6v20h-24v-20zm0-2h-24a2 2 0 0 0 -2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-20a2 2 0 0 0 -2-2z" />
                    <path d="m6 10h7v2h-7z" />
                    <path d="m6 14h4v2h-4z" />
                    <path d="m23 18h-6a3 3 0 0 0 -3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0 -3-3z" />
                    <path d="m20 17a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
                    <path d="m0 0h32v32h-32z" fill="none" />
                </svg>
            </InputGroup>

            <InputGroup label="Adresse" type="text" placeholder="22 Rue de la Ville 75000 Paris .." :value="address"
                @input="address = $event.target.value" :isRequired="true">
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                    fill="none" style="fill: #9B9B9B;">
                    <path
                        d="M19.367 18.102L18 14h-1.5l.833 4H2.667l.833-4H2L.632 18.102C.285 19.146.9 20 2 20h16c1.1 0 1.715-.854 1.367-1.898zM15 5A5 5 0 1 0 5 5c0 4.775 5 10 5 10s5-5.225 5-10zm-7.7.06c0-1.491 1.208-2.699 2.7-2.699a2.699 2.699 0 1 1 0 5.399 2.7 2.7 0 0 1-2.7-2.7z" />
                </svg>
            </InputGroup>
            <InputGroup label="Téléphone" type="text" placeholder="+33751125896" :value="phone"
                @input="phone = $event.target.value" :isRequired="true">
                <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" style="fill: #9B9B9B;"><path d="m0 0h24v24h-24z"  opacity="0"/><g ><path d="m13 8a3 3 0 0 1 3 3 1 1 0 0 0 2 0 5 5 0 0 0 -5-5 1 1 0 0 0 0 2z"/><path d="m13 4a7 7 0 0 1 7 7 1 1 0 0 0 2 0 9 9 0 0 0 -9-9 1 1 0 0 0 0 2z"/><path d="m21.75 15.91a1 1 0 0 0 -.72-.65l-6-1.37a1 1 0 0 0 -.92.26c-.14.13-.15.14-.8 1.38a9.91 9.91 0 0 1 -4.87-4.89c1.27-.64 1.28-.64 1.41-.79a1 1 0 0 0 .26-.92l-1.37-5.93a1 1 0 0 0 -.65-.72 3.79 3.79 0 0 0 -.72-.18 3.94 3.94 0 0 0 -.77-.1 4.6 4.6 0 0 0 -4.6 4.6 15.42 15.42 0 0 0 15.4 15.4 4.6 4.6 0 0 0 4.6-4.6 4.77 4.77 0 0 0 -.06-.76 4.34 4.34 0 0 0 -.19-.73zm-4.35 4.09a13.41 13.41 0 0 1 -13.4-13.4 2.61 2.61 0 0 1 2.6-2.6h.33l1.07 4.64-.54.28c-.86.45-1.54.81-1.18 1.59a11.85 11.85 0 0 0 7.18 7.21c.84.34 1.17-.29 1.62-1.16l.29-.55 4.63 1.06v.33a2.61 2.61 0 0 1 -2.6 2.6z"/></g></svg>
            </InputGroup>

            <InputGroup label="Email" type="email" placeholder="exemple@gmail.com" :value="email"
                @input="email = $event.target.value" :isRequired="true">
                <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                        <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill="" />
                    </g>
                </svg>
            </InputGroup>

            <InputGroup label="Mot de passe" type="password"
                placeholder="12 caractères,1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 symbole"
                :value="password" @input="password = $event.target.value" :isRequired="true">
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
                <input type="submit" @click="register" value="Inscirption"
                    class="w-full cursor-pointer rounded-lg border border-primary bg-[#C58940] p-4 font-medium text-white transition hover:bg-opacity-90" />
            </div>

            <button
                class="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 font-medium hover:bg-opacity-70 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-70">
                <span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_191_13499)">
                            <path
                                d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                                fill="#4285F4" />
                            <path
                                d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                                fill="#34A853" />
                            <path
                                d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                                fill="#FBBC05" />
                            <path
                                d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                                fill="#EB4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_191_13499">
                                <rect width="20" height="20" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </span>
                Sign in with Google
            </button>

            <div class="mt-6 text-center">
                <p class="font-medium">
                    Vous avez déja un compte ?
                    <router-link to="/connexion" class="text-[#C58940]">Connectez-vous.</router-link>
                </p>
            </div>
        </DefaultAuthCard>
    </DefaultLayout>
</template>
