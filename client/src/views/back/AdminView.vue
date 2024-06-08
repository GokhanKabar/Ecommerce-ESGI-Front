<script setup lang="ts">
import DefaultLayout from '../../components/back/layouts/DefaultLayout.vue';
import DataStatsOne from "@/components/back/componentsGeneric/DataStats/DataStatsOne.vue";
import ChartOne from "@/components/back/componentsGeneric/Charts/ChartOne.vue";
import ChartTwo from "@/components/back/componentsGeneric/Charts/ChartTwo.vue";
import ChartThree from "@/components/back/componentsGeneric/Charts/ChartThree.vue";
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <DataStatsOne />
    </div>

    <div class="mt-4 grid grid-cols-12 px-5 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <!-- ====== Chart One Start -->
      <ChartOne />
      <!-- ====== Chart One End -->

      <!-- ====== Chart Two Start -->
      <ChartTwo />
      <!-- ====== Chart Two End -->

      <!-- ====== Chart Three Start -->
      <ChartThree />
      <!-- ====== Chart Three End -->

     </div>
  </DefaultLayout>
</template>
