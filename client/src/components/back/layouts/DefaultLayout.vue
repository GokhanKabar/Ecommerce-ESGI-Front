<script setup lang="ts">
import HeaderArea from '@/components/back/Header/HeaderArea.vue';
import Sidebar from '@/components/back/SideBar/Sidebar.vue';
import { ref } from 'vue';

const showSidebar = ref(false);

const getShowSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

</script>

<template>
    <div class="relative flex min-h-screen">

        <!-- ===== Page Wrapper Start ===== -->
        <!-- ===== Sidebar Start ===== -->
        <Sidebar :showSidebar="showSidebar" />
        <!-- ===== Sidebar End ===== -->

        <!-- ===== Content Area Start ===== -->
        <!-- ===== Header Start ===== -->
        <HeaderArea :showSidebar="showSidebar" :getShowSidebar="getShowSidebar" />
        <div class="flex-1">
        </div>
        <!-- ===== Header End ===== -->

        <!-- ===== Main Content Start ===== -->
        <main>
            <slot></slot>
        </main>
        <!-- ===== Main Content End ===== -->
        <!-- ===== Page Wrapper End ===== -->


    </div>
</template>
