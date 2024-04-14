<script setup lang="ts">
import HeaderArea from '../Header/HeaderArea.vue';
import FooterArea from '../Footer/FooterArea.vue';
</script>

<template>


    <!-- ===== Header  Start ===== -->
    <HeaderArea />
    <!-- ===== Header  End ===== -->

    <!-- ===== Main Content Start ===== -->
    <main>
        <slot></slot>
    </main>
    <!-- ===== Main Content End ===== -->
    <!-- ===== Footer  Start ===== -->

    <FooterArea />
    <!-- ===== Footer  End ===== -->
</template>
