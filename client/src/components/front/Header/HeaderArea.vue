<script setup lang="ts">
import LogoIcon from '@/components/front/icons/LogoIcon.vue'
import Basket from '@/components/front/Header/Basket.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import getImagePath from '@/utils/getImagePath'

const showNav = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

const route = useRoute()
const router = useRouter()

const toggleNav = () => {
  showNav.value = !showNav.value
}

const handleSearch = async () => {
  if (searchQuery.value) {
    try {
      const response = await fetch(`http://localhost:8000/search?q=${searchQuery.value}`)
      if (!response.ok) throw new Error('Network response was not ok')
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Error fetching search results:', error)
      searchResults.value = []
    }
  } else {
    searchResults.value = []
  }
}

const goToProductPage = (id) => {
  router.push(`/product/${id}`)
}
</script>

<template>
  <header class="flex flex-col">
    <div
      class="bg-[#1D1D1D] shadow w-full h-28 flex flex-row justify-around items-center px-4 md:px-14 lg:px-32"
    >
      <div class="flex flex-row items-center gap-10">
        <button @click="toggleNav" class="text-[#C58940] font-extrabold lg:hidden md:inline-block">
          <svg
            v-if="showNav"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-10 h-10"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-10 h-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
            />
          </svg>
        </button>
        <router-link to="/">
          <LogoIcon class="w-32 h-auto md:w-32 lg:w-52" />
        </router-link>
      </div>
      <div class="max-w-md mx-auto relative">
        <div
          class="relative flex items-center lg:w-[30rem] h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden md:w-[10rem]"
        >
          <div class="grid place-items-center h-full w-12 text-[#D8B775]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Rechercher"
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
        <div
          v-if="searchResults.length"
          class="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10"
        >
          <ul>
            <li
              v-for="result in searchResults"
              :key="result._id"
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              @click="goToProductPage(result._id)"
            >
              <img
                :src="getImagePath(result.image)"
                alt="result.name"
                class="w-10 h-10 inline-block"
              />
              <span class="ml-2">{{ result.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-row gap-5">
        <div class="nav-item">
          <router-link to="/connexion" class="flex flex-row gap-1">
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2_473)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.6296 16.23V15.8364C14.6296 12.2364 11.724 9.3148 8.13999 9.3148C4.55599 9.3148 1.65039 12.2332 1.65039 15.8364V16.23H14.6296Z"
                  fill="#D8B775"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.13039 0.869999C10.06 0.869999 11.6248 2.4284 11.6248 4.3484C11.6248 6.2684 10.06 7.8268 8.13039 7.8268C6.20079 7.8268 4.63599 6.2684 4.63599 4.3484C4.63599 2.4284 6.20079 0.869999 8.13039 0.869999Z"
                  fill="#D8B775"
                />
              </g>
              <defs>
                <clipPath id="clip0_2_473">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.140015 0.549999)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span class="hidden md:inline-block text-white hover:text-[#D8B775] font-semibold"
              >MON COMPTE</span
            >
          </router-link>
        </div>
        <Basket />
      </div>
    </div>
    <nav
      :class="{ hidden: !showNav }"
      class="bg-[#333333] shadow w-full flex flex-col justify-center items-center px-4 py-3 lg:flex lg:flex-row lg:gap-20 lg:items-center"
    >
      <router-link
        to="/"
        class="text-white my-2 flex items-center"
        :class="{ 'flex flex-col justify-center !text-[#D8B775]': route.path === '/' }"
        >ACCUEIL<span class="text-[#D8B775] h-0 font-bold" v-if="route.path === '/'"
          >*</span
        ></router-link
      >
      <router-link
        to="/homme"
        class="text-white my-2 flex items-center"
        :class="{ 'flex flex-col justify-center !text-[#D8B775]': route.path === '/homme' }"
        >HOMME<span class="text-[#D8B775] h-0" v-if="route.path === '/homme'">*</span></router-link
      >
      <router-link
        to="/femme"
        class="text-white my-2 flex items-center"
        :class="{ 'flex flex-col justify-center !text-[#D8B775]': route.path === '/femme' }"
        >FEMME<span class="text-[#D8B775] h-0" v-if="route.path === '/femme'">*</span></router-link
      >
      <router-link
        to="/marque"
        class="text-white my-2 flex items-center"
        :class="{ 'flex flex-col justify-center !text-[#D8B775]': route.path === '/marque' }"
        >MARQUE<span class="text-[#D8B775] h-0" v-if="route.path === '/marque'"
          >*</span
        ></router-link
      >
      <router-link
        to="/contact"
        class="text-white my-2 flex items-center"
        :class="{ 'flex flex-col justify-center !text-[#D8B775]': route.path === '/contact' }"
        >CONTACT<span class="text-[#D8B775] h-0" v-if="route.path === '/contact'"
          >*</span
        ></router-link
      >
    </nav>
  </header>
</template>
