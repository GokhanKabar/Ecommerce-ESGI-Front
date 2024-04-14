<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
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

</script>

<template>
  <div class="relative flex min-h-screen">
    <div class="bg-[#1D1D1D] text-cyan-100 w-64 absolute inset-y-0 left-0 transform -translate-x-full  transition duration-200 ease-in-out md:relative md:-translate-x-0" :class="{'relative -translate-x-0' : showSidebar}">
      <a href="" class="flex flex-row items-center justify-center p-2">
       <LogoIcon />
      </a>
      <hr>
      <nav>
        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'dashboard'">
          <HomeIcon />
          <span class="text-white font-normal ml-2"> Dashboard</span>
        </a>

        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'team'">
          <TeamIcon />
          <span class="text-white font-normal ml-2"> Team</span>
        </a> 
        
        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'projects'">
          <ProjectsIcon />
          <span class="text-white font-normal ml-2"> Projects</span>
        </a>
        
        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'calendar'">
          <CalendarIcon />
          <span class="text-white font-normal ml-2"> Calendar</span>
        </a> 
        
        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'documents'">
          <DocumentsIcon />
          <span class="text-white font-normal ml-2"> Documents</span>
        </a>
        
        <a href="" class="flex flex-row items-center py-3 px-5 m-2 hover:bg-[#D8B775] rounded : activeItem === 'reports'">
          <ReportsIcon />
          <span class="text-white font-normal ml-2"> Reports</span>
        </a>
      </nav>
    </div>
    
  </div>
</template>
