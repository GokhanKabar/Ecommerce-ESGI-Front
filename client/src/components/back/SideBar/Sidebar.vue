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

const props = defineProps({
  showSidebar: Boolean,
});

const activeItem = ref('');

onMounted(() => {
  const path = window.location.pathname;
  if (path.includes('/admin/users')) {
    activeItem.value = 'team';
  } else if (path.includes('/admin/orders')) {
    activeItem.value = 'projects';
  } else if (path.includes('/admin/category')) {
    activeItem.value = 'calendar';
  } else if (path.includes('/admin/products')) {
    activeItem.value = 'documents';
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
        <a href="/admin" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'dashboard'}">
          <HomeIcon />
          <span class="text-white font-normal ml-2"> Dashboard</span>
        </a>

        <a href="/admin/users" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'team'}">
          <TeamIcon />
          <span class="text-white font-normal ml-2">Utilisateurs</span>
        </a> 
        
        <a href="/admin/orders" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'projects'}">
          <ProjectsIcon />
          <span class="text-white font-normal ml-2">Commandes</span>
        </a>
        
        <a href="/admin/category" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'calendar'}">
          <CalendarIcon />
          <span class="text-white font-normal ml-2">Catégories</span>
        </a> 
        
        <a href="/admin/products" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'documents'}">
          <DocumentsIcon />
          <span class="text-white font-normal ml-2">Produits</span>
        </a>
        
        <a href="/admin/reports" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#f9d896] rounded" :class="{'bg-[#D8B775]': activeItem === 'reports'}">
          <ReportsIcon />
          <span class="text-white font-normal ml-2">Statistiques & Rapports</span>
        </a>
      </nav>
    </div>
  </div>
</template>

