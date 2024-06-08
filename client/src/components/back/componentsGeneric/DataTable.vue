<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ButtonMini from './Buttons/ButtonMini.vue';

interface RowData {
  id: number;
  [key: string]: any;
}

interface Props {
  headers: string[];
  data: RowData[];
  filterableColumns: string[];
  editUser: (row: any) => void;
  deleteUser:(row:any)=>void;
}
const props = defineProps<Props>();

const filters = ref<{ [key: string]: string }>({});

const perPage = 5;

const currentPage = ref(1);

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return filteredData.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / perPage);
});

const displayedHeaders = computed(() => {
  // Adjust headers based on filtered data if necessary
  return props.headers;
});

const filteredData = computed(() => {
  return props.data.filter(row => {
    return Object.keys(filters.value).every(key => {
      return String(row[key.toLowerCase()]).toLowerCase().includes(String(filters.value[key]).toLowerCase());
    });
  });
});

const downloadCSV = () => {
  const csvData = [
    props.headers.join(','),
    ...filteredData.value.map(row => props.headers.map(header => row[header.toLowerCase()]).join(','))
  ].join('\n');
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'table.csv');
};

const downloadExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredData.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'table.xlsx');
};
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [props.headers],
    body: filteredData.value.map(row => props.headers.map(header => row[header.toLowerCase()]))
  });
  doc.save('table.pdf');
};

const previousPage = () => {
  currentPage.value--;
};

const nextPage = () => {
  currentPage.value++;
};

// Watch for changes in filters or currentPage and recalculate paginatedData
watch([filters, currentPage], () => {
  // Do nothing, just trigger the computed property
  paginatedData.value;
});
</script>

<template>
  <div class="overflow-auto rounded-lg border border-gray-3 shadow-9 m-5">
    <!-- Buttons for downloading CSV, Excel, and PDF -->
    <div class="flex justify-end m-2">
      <ButtonMini @click="downloadCSV" label="CSV" customClasses="text-white rounded-md bg-secondary"><svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12V19M12 19L9.75 16.6667M12 19L14.25 16.6667M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/></svg></ButtonMini>
      <ButtonMini @click="downloadExcel" label="Excel" customClasses="text-white rounded-md bg-secondary"><svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12V19M12 19L9.75 16.6667M12 19L14.25 16.6667M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/></svg></ButtonMini>
      <ButtonMini @click="downloadPDF" label="PDF" customClasses="text-white rounded-md bg-secondary"><svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12V19M12 19L9.75 16.6667M12 19L14.25 16.6667M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/></svg></ButtonMini>
    </div>
    <!-- Table header -->
    <table class="w-full border-collapse bg-white text-left text-sm text-gray-500 ">
      <thead class="bg-gray-3">
      <tr>
        <th v-for="header in displayedHeaders" :key="header" scope="col" class="pl-2 py-4 font-medium text-gray-100 text-center">
          <div class="flex flex-row items-center">
          {{ header }}
          <!-- Filtering input -->
          <input v-if="props.filterableColumns.includes(header)" v-model="filters[header]" placeholder="Filter" class="ml-2 p-1 w-25 border border-gray-300 rounded" />
        </div>
        </th>
        <th scope="col" class="px-6 py-4 font-medium text-gray-400 ">Action</th>
      </tr>
      </thead>
      <!-- Table body with pagination -->
      <tbody class="divide-y divide-gray-3  border-x-gray-3">
      <tr v-for="(row) in paginatedData" :key="row.id" class="hover:bg-gray-3">
        <td v-for="header in displayedHeaders" :key="header" class="px-6 py-4">
          {{ row[header.toLowerCase()] }}
        </td>
        <td class="px-6 py-4 text-center">
          <!-- Actions -->
          <div class="flex justify-start gap-4">
            <a @click="props.deleteUser(row)">
              <!-- Edit icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </a>
            <a @click="props.editUser(row)" class="">
              <!-- Delete icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </a>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Pagination controls -->
    <div class="flex justify-center items-center my-2">
      <svg @click="currentPage !== 1 ? previousPage() : null" :class="{ 'disabled': currentPage === 1 }" fill="#000000"
           height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512"
           xml:space="preserve">
<path d="M274.3,262.5L512,381.4V143.6L274.3,262.5z M36.6,262.5l237.7,118.9V262.5V143.6L36.6,262.5z M0,143.6v237.7h36.6V262.5
	V143.6H0z"/>
</svg>
      <span class="mx-4">Page {{ currentPage }} of {{ totalPages }}</span>

      <svg @click="currentPage !== totalPages ? nextPage() : null" :class="{ 'disabled': currentPage === totalPages }"
           fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512"
           xml:space="preserve">
<path d="M0,381.4l237.7-118.9L0,143.6V381.4z M237.7,262.5v118.9l237.7-118.9L237.7,143.6V262.5z M475.4,143.6v118.9v118.9H512
	V143.6H475.4z"/>
</svg>
    </div>
  </div>
</template>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}


</style>