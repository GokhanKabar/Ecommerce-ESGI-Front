<script setup lang="ts">
import Icons from '../icons/Icons.vue'
import LogoIcon from '../icons/LogoIcon.vue'
</script>

<template>
  <footer class="flex flex-col">
    <div
      class="bg-[#1D1D1D] shadow w-full md:flex md:flex-col md:justify-center md:items-center sm:flex sm:flex-col sm:justify-center sm:items-center lg:flex lg:flex-row lg:justify-around"
    >
      <div class="flex flex-row items-center w-[20rem] py-5">
        <Icons iconName="Time" />
        <div class="ml-4">
          <router-link to="#" class="text-white font-semibold hover:text-[#D8B775]"
            >LIVRAISON RAPIDE</router-link
          >
          <br />
          <p class="leading-none text-[#969696] italic text-xs">
            24 ou 48h les jours ouvrés chez votre commerçant
          </p>
        </div>
      </div>
      <div class="flex flex-row items-center w-[20rem] py-5">
        <Icons iconName="Turck" />
        <div class="ml-4">
          <router-link to="#" class="text-white font-semibold hover:text-[#D8B775]"
            >Livraison offerte</router-link
          >
          <br />
          <p class="leading-none text-[#969696] italic text-xs">dès 60 € d’achat</p>
        </div>
      </div>

      <div class="flex flex-row items-center w-[20rem] py-5">
        <Icons iconName="Security" />
        <div class="ml-4">
          <router-link to="#" class="text-white font-semibold hover:text-[#D8B775]"
            >Paiement sécurisé</router-link
          >
          <br />
          <img src="https://i.goopics.net/4l01b9.png" alt="Paiement" />
        </div>
      </div>
      <div class="flex flex-row items-center w-[20rem] py-5">
        <Icons iconName="Star" />
        <div class="ml-4">
          <router-link to="#" class="text-white font-semibold hover:text-[#D8B775]"
            >Avantages fidélité</router-link
          >
          <br />
          <p class="leading-none text-[#969696] italic text-xs">
            5% de votre commande sur votre prochain achat
          </p>
        </div>
      </div>
    </div>
    <hr />
    <div
      class="bg-[url('https://i.goopics.net/s9mum3.png')] shadow w-full h-52 flex flex-col items-center justify-center"
    >
      <h1 class="text-2xl text-white mb-5">INSCRIPTION À LA NEWSLETTER</h1>
      <div class="flex space-x-4">
        <div class="flex rounded-md overflow-hidden w-full">
          <input
            type="text"
            class="w-[30rem] rounded-md rounded-r-none p-5"
            placeholder="Votre e-mail"
          />
          <button class="bg-[#D8B775] text-white px-6 text-lg font-semibold py-4 rounded-r-md">
            Ok
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#1D1D1D] h-56 flex flex-row justify-around items-start p-5">
      <div class="flex flex-col items-center">
        <h1 class="text-white text-2xl mb-2">Informations</h1>
        <span class="inline-block h-2 w-2 bg-[#D8B775] rounded-full mb-2"></span>
        <ul class="flex flex-col items-center">
          <router-link to="/mention-legale" class="text-white hover:text-[#D8B775] text-sm mb-1"
            >Mentions légales</router-link
          >
          <router-link to="/protection-donnees" class="text-white hover:text-[#D8B775] text-sm mb-1"
            >Politique de protection des données</router-link
          >
          <router-link to="/cgu-cgv" class="text-white hover:text-[#D8B775] text-sm mb-1"
            >Conditions générales de vente</router-link
          >
          <router-link to="/paiement-securise" class="text-white hover:text-[#D8B775] text-sm mb-1"
            >Paiements sécurisés</router-link
          >
        </ul>
      </div>
      <div class="flex flex-col items-center">
        <h1 class="text-white text-2xl mb-2">Nous contacter</h1>
        <span class="inline-block h-2 w-2 bg-[#D8B775] rounded-full mb-2"></span>
        <p class="text-white">01 02 03 04 05</p>
        <p class="text-white">contact@parfum-esgi.fr</p>
        <p class="text-white">242 Rue du Faubourg Saint-Antoine, 75012 Paris</p>
        <span class="text-xs text-[#969696]"
          >Le service client est ouvert du Mardi au Samedi
          <br />
          de 10h à 12h et de 14h à 17h30 (hors jours fériés)</span
        >
      </div>
      <div class="flex flex-col items-center">
        <h1 class="text-white text-2xl mb-2">Nous suivre</h1>
        <span class="inline-block h-2 w-2 bg-[#D8B775] rounded-full mb-2"></span>
        <ul class="flex flex-row mb-3">
          <router-link
            to="#"
            class="w-10 h-10 border border-[#D8B775] rounded-full flex flex-row justify-center items-center mx-2 hover:bg-[#D8B775]"
            ><Icons iconName="Facbook"
          /></router-link>
          <router-link
            to="#"
            class="w-10 h-10 border border-[#D8B775] rounded-full flex flex-row justify-center items-center mx-2 hover:bg-[#D8B775]"
            ><Icons iconName="Twitter"
          /></router-link>
          <router-link
            to="#"
            class="w-10 h-10 border border-[#D8B775] rounded-full flex flex-row justify-center items-center mx-2 hover:bg-[#D8B775]"
            ><Icons iconName="Instagram"
          /></router-link>
          <router-link
            to="#"
            class="w-10 h-10 border border-[#D8B775] rounded-full flex flex-row justify-center items-center mx-2 hover:bg-[#D8B775]"
            ><Icons iconName="Youtube"
          /></router-link>
        </ul>
        <LogoIcon />
      </div>
    </div>
  </footer>
</template>
