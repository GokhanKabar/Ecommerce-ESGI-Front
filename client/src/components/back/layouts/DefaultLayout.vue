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
        <div class="flex flex-col w-full"> <!-- Ajout de la classe flex-col pour afficher les enfants en colonnes -->
            <!-- ===== Header Start ===== -->
            <HeaderArea :showSidebar="showSidebar" :getShowSidebar="getShowSidebar" />
            <!-- ===== Header End ===== -->

            <!-- ===== Main Content Start ===== -->
            <main class="flex-grow">
                <slot></slot>
            </main>
            <!-- ===== Main Content End ===== -->
        </div>
        <!-- ===== Content Area End ===== -->
        <!-- ===== Page Wrapper End ===== -->

    </div>
</template>

<style scoped>
.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.min-h-screen {
    min-height: 100vh;
}

.w-full {
    width: 100%;
}

.flex-grow {
    flex-grow: 1;
}
</style>
