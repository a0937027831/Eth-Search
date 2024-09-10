<template>
  <XSearchTable
    v-model="selected"
    :headers="headers"
    :items="items"
    :apiFunc="fetchData"
    :pageObject="pageObject"
    item-key="table_header_index"
    @dataLoaded="dataLoaded"
    useAutoSearch
    show-select
  >
  </XSearchTable>
  <XInput
    v-model="inp"
    clear-icon="mdi-close-circle"
    clearable
    @click:clear="clearMessage"
  ></XInput>
  <v-checkbox></v-checkbox>
</template>
<script setup>
import { reactive, ref } from 'vue';
const inp = ref('')
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
]);


const items = ref([
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
  { id:'123', name: '123'},
]);

const selected = ref([])

function clearMessage () {
  
}

const pageObject = reactive({
  page: 0,
  totalPages: 10,
});

function selectFunc(value){
  console.log('select value',value)
}

function dataLoaded(data){
  items.value = [...items.value, ...data];
  pageObject.page += 1;
  pageObject.totalPages += 1;
}


// 模擬 API 函數（在實際使用中應該從外部傳入）
const fetchData = async (parms) => {
  console.log('fetchData')
  await new Promise(resolve => setTimeout(resolve, 500));

  return Array.from({ length: 20 }, (_, i) => ({
    id: (parms.page - 1) * 20 + i + 1,
    name: `Item ${(parms.page - 1) * 20 + i + 1}`,
  }));
};
</script>
<style></style>