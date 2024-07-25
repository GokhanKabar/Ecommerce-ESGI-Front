<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import StatisticsService from '../../../../services/StatisticService.js'

const chartData = ref({
  series: [],
  labels: ['Femme', 'Homme']
})

const chart = ref(null)

const apexOptions = {
  chart: {
    type: 'donut',
    width: 380
  },
  colors: ['#C28B00', '#C27A00'],
  labels: chartData.value.labels,
  legend: {
    show: false,
    position: 'bottom'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ]
}

onMounted(async () => {
  const response = await StatisticsService.getStatistics();
  const categoryProductCounts = response.data.categoryProductCounts;
   const totalCount = categoryProductCounts.reduce((sum, category) => sum + category.count, 0);
  
  const percentages = categoryProductCounts.map(category => 
    Number(((category.count / totalCount) * 100).toFixed(2))
  );
  
  chartData.value.series = percentages;
})

</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 xl:col-span-5"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-xl font-bold">Pourcentage de ventes par Catégorie</h4>
      </div>
      <div>
        <div class="relative z-20 inline-block">
          <span class="absolute top-1/2 right-3 z-10 -translate-y-1/2">
            
          </span>
        </div>
      </div>
    </div>
    <div class="mb-2">
      <div id="chartThree" class="mx-auto flex justify-center">
        <VueApexCharts
          type="donut"
          width="340"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
    <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
      <div class="w-full px-8 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#C28B00]"></span>
          <p class="flex w-full justify-between text-sm font-medium text-black">
            <span> Femme </span>
            <span> {{ chartData.series[0] }}% </span>
          </p>
        </div>
      </div>
      <div class="w-full px-8 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#C27A00]"></span>
          <p class="flex w-full justify-between text-sm font-medium text-black ">
            <span> Homme </span>
            <span> {{ chartData.series[1] }}% </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
