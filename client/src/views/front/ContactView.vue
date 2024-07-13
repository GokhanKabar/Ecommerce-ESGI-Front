<script setup lang="ts">
import DefaultLayout from '../../components/front/layouts/DefaultLayout.vue';
import DefaultContactCard from '@/components/front/Authentification/DefaultContactCard.vue'
import InputGroup from '@/components/front/Authentification/InputGroup.vue'
import SelectGroupOne from '@/components/back/componentsGeneric/Forms/SelectGroup/SelectGroupOne.vue'
</script>

<template>
  <DefaultLayout>
<DefaultContactCard subtitle="E-parfums" title="Contactez-Nous">

  <InputGroup label="Nom" type="text" placeholder="">
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

  <InputGroup label="Prénom" type="Prénom" placeholder="">
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
  
  <InputGroup label="Email" type="email" placeholder="Enter your email">
        <svg class="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <path
              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
              fill="" />
          </g>
        </svg>
      </InputGroup>

  <SelectGroupOne/>
  <InputGroup label="Message" type="text" placeholder="message">
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

  <div class="mb-5 mt-6">
    <input type="submit"  value="Envoyer"
      class="w-full cursor-pointer rounded-lg border border-primary bg-[#C58940] p-4 font-medium text-white transition hover:bg-opacity-90" />
  </div>

 
</DefaultContactCard>

  </DefaultLayout>
</template>
