<template>
  <TableWrapper>
    <template #header>
      <h1>測試頁面</h1>
    </template>
    <template #table="{ tableBlock, teleportId }">
      <Table
        :headers="headers"
        :items="items"
        :teleportId="teleportId"
        :loading="loading"
        :no-data-text="noDataMessage"
      />
    </template>
  </TableWrapper>
  <XButton @click="simulateEmptyItems">模擬沒有資料</XButton>
  <XButton @click="simulateMoreItems">模擬有資料</XButton>
</template>
<script setup>
import { ref } from 'vue'
import TableWrapper from '@/viewsComponent/TableWrapper.vue';
import Table from '@/viewsComponent/table.vue';

const noDataMessage = '沒有資料';
const loading = ref(false);

//todo mocked data header & iteams for table
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Value', key: 'value' }
])

const items = ref([
  { id: 1, name: 'Item 1', value: 'Value 1' },
  { id: 2, name: 'Item 2', value: 'Value 2' },
  { id: 3, name: 'Item 3', value: 'Value 3' }
])

function simulateEmptyItems() {
  loading.value = true;
  setTimeout(() => {
    items.value = [];
    loading.value = false;
  }, 1500);
}

function simulateMoreItems() {
  loading.value = true;
  setTimeout(() => {
    items.value = [
      { id: 1, name: 'Item 1', value: 'Value 1' },
      { id: 2, name: 'Item 2', value: 'Value 2' },
      { id: 3, name: 'Item 3', value: 'Value 3' },
      { id: 4, name: 'Item 4', value: 'Value 4' },
      { id: 5, name: 'Item 5', value: 'Value 5' }
    ];
    loading.value = false;
  }, 1500);
}


</script>
