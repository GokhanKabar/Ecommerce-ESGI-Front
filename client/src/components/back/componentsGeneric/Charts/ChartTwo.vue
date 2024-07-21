<script setup lang="ts">
import { computed, onMounted,ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import StatisticsService from '../../../../services/StatisticService.js'

const chartData = ref({
  series: [
    { name: 'Total Ventes', data: [] },
    { name: 'Total Revenus €', data: [] }
  ]
})

const labels = ref([])

const apexOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last'
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: { radius: 99 }
  },
  fill: { opacity: 1 },
  colors: ['#C28B00', '#D6C553'],
  xaxis: {
    categories: labels.value
  }
}))

onMounted(async () => {
  try {
    const response = await StatisticsService.getStatistics()
    const weeklyData = response.data.weeklyData

    chartData.value = {
      series: [
        { name: 'Total Ventes', data: weeklyData.series[0].data },
        { name: 'Total Revenus €', data: weeklyData.series[1].data }
      ]
    }

    labels.value = weeklyData.labels
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
  }
})
</script>

<template>
  <div class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default xl:col-span-4">
    <div class="mb-4 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-xl font-bold text-black">Profit cette semaine</h4>
      </div>
    </div>

    <div>
      <div id="chartTwo" class="-ml-5 -mb-9">
        <VueApexCharts
          type="bar"
          height="335"
          :options="apexOptions"
          :series="chartData.series"
        />
      </div>
    </div>
  </div>
</template>
