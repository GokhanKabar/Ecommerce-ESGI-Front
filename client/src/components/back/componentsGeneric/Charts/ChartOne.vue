<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import StatisticService from '../../../../services/StatisticService.js'

const chartData = ref({
  series: [
    {
      name: 'Total Ventes',
      data: []
    },
    {
      name: 'Total Revenus',
      data: []
    }
  ],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})
const chart = ref(null)

const apexOptions = ref({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  },
  colors: ['#C28B00', '#D6C553'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },
    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: 'smooth'
  },
  labels: {
    show: false,
    position: 'top'
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#C28B00', '#D6C553'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5
    }
  },
  xaxis: {
    type: 'category',
    categories: chartData.value.labels,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px'
      }
    },
    min: 0
  }
})

watch(chartData, (newValue) => {

  const maxYValue = Math.max(
    ...newValue.series[0].data,
    ...newValue.series[1].data
  ) * 1.1
  apexOptions.value.xaxis.categories = newValue.labels
  apexOptions.value.yaxis.max = maxYValue
}, { deep: true })

onMounted(async () => {
  try {
    const response = await StatisticService.getStatistics()
    
    const data = response.data
    chartData.value.series[0].data = data.monthlyData.series[0].data
    chartData.value.series[1].data = data.monthlyData.series[1].data
    chartData.value.labels = data.monthlyData.labels
    
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }
})
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 xl:col-span-8"
  >
    <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
      <div class="flex w-full flex-wrap gap-3 sm:gap-5">
        <div class="flex min-w-47.5">
          <span
            class="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#C28B00]"
          >
            <span class="block h-2.5 w-full max-w-2.5 rounded-full bg-[#C28B00]"></span>
          </span>
          <div class="w-full">
            <p class="font-semibold text-[#C28B00]">Total Ventes</p>
          </div>
        </div>
        <div class="flex min-w-47.5">
          <span
            class="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary"
          >
            <span class="block h-2.5 w-full max-w-2.5 rounded-full bg-[#D6C553]"></span>
          </span>
          <div class="w-full">
            <p class="font-semibold text-[#D6C553]">Total Revenus €</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div id="chartOne" class="-ml-5">
        <VueApexCharts
          type="area"
          height="350"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
  </div>
</template>
