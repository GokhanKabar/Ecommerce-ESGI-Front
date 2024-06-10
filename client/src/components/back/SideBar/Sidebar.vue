<!-- eslint-disable vue/multi-word-component-names -->
<script setup="ts">
import { ref, onMounted } from 'vue';
import HomeIcon from '../icons/HomeIcon.vue';
import LogoIcon from '../icons/LogoIcon.vue';
import CalendarIcon from '../icons/CalendarIcon.vue';
import DocumentsIcon from '../icons/DocumentsIcon.vue';
import ReportsIcon from '../icons/ReportsIcon.vue';
import ProjectsIcon from '../icons/ProjectsIcon.vue';
import TeamIcon from '../icons/TeamIcon.vue';

import { isAdmin, isStoreKeeper, isUser } from '../../../store/roleManagement.js';

const props = defineProps({
  showSidebar: Boolean,
});

const activeItem = ref('');

onMounted(() => {
  const path = window.location.pathname;
  if (path.includes('/admin/users')) {
    activeItem.value = 'users';
  } else if (path.includes('/admin/orders')) {
    activeItem.value = 'orders';
  } else if (path.includes('/admin/brand')) {
    activeItem.value = 'brand'; 
  } else if (path.includes('/admin/family')) {
      activeItem.value = 'family';
  } else if (path.includes('/admin/products')) {
    activeItem.value = 'products';
  } else if (path.includes('/admin/reports')) {
    activeItem.value = 'reports';
  } else {
    activeItem.value = 'dashboard';
  }
});
</script>

<template>
  <div class="relative flex min-h-screen">
    <div class="bg-[#1D1D1D] text-cyan-100 w-64 absolute inset-y-0 left-0 transform -translate-x-full transition duration-200 ease-in-out md:relative md:-translate-x-0" :class="{'relative -translate-x-0' : showSidebar}">
      <a href="" class="flex flex-row items-center justify-center p-2">
        <LogoIcon />
      </a>
      <hr>
      <nav>
        <RouterLink v-if="isAdmin() || isStoreKeeper() || isUser()" to="/admin" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'dashboard'}">
          <HomeIcon />
          <span class="text-white font-normal ml-2"> Dashboard</span>
        </RouterLink>

        <RouterLink v-if="isAdmin()" to="/admin/users" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'users'}">
          <TeamIcon />
          <span class="text-white font-normal ml-2">Utilisateurs</span>
        </RouterLink> 
        
        <RouterLink v-if="isAdmin() || isStoreKeeper() || isUser()" to="/admin/orders" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'orders'}">
          <ProjectsIcon />
          <span class="text-white font-normal ml-2">Commandes</span>
        </RouterLink>
      
        <RouterLink v-if="isAdmin() || isStoreKeeper()" to="/admin/brand" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'brand'}">
          <CalendarIcon />
          <span class="text-white font-normal ml-2">Marques</span>
        </RouterLink>
        
        <RouterLink v-if="isAdmin() || isStoreKeeper()" to="/admin/family" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'family'}">
          <CalendarIcon />
          <span class="text-white font-normal ml-2">Familles</span>
        </RouterLink>
        
        <RouterLink v-if="isAdmin() || isStoreKeeper()" to="/admin/products" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'products'}">
          <DocumentsIcon />
          <span class="text-white font-normal ml-2">Produits</span>
        </RouterLink>
        
        <RouterLink v-if="isAdmin()" to="/admin/reports" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'reports'}">
          <ReportsIcon />
          <span class="text-white font-normal ml-2">Rapports</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>
