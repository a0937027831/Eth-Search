<template>
  <XTable
    ref="dataTable"
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer
    items-per-page="-1"
    height="400px"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
  </XTable>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue';
import { simpleAwait } from '@/utils/simple-await.js';

const props = defineProps({
  headers: Array,
  items: Array,
  apiFunc: {
    type: Function,
  },
  pageObject: {
    type: Object,
    default: () => ({
      page: 0,
      totalPages: 0,
    })
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  useAutoSearch: {
    type: Boolean,
    default: false,
  },
});

// lodash
const instance = getCurrentInstance();
const _ = instance.appContext.config.globalProperties._;

// emit
const emit = defineEmits(['dataLoaded']);

// loading
const loading = ref(false);

// table dom
const dataTable = ref(null);


const loadMoreItems = async () => {
  if (loading.value || props.pageObject.page > props.pageObject.totalPages) return;
  loading.value = true;

  // 使用 simpleAwait 來處理 API 調用
  const [error, newItems] = await simpleAwait(props.apiFunc(props.pageObject), 
    () => { loading.value = false; }
  );

  if (error) {
    console.error('Error loading data:', error);
    return;
  }

  emit('dataLoaded', newItems);
};

// 創建滾動事件處理器，並將回調函數進行防抖處理
const createScrollHandler = (callback) => {
  const debouncedCallback = _.debounce(callback, 200);
  return (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      console.log("botton");
      debouncedCallback();
    }
  };
};

// 使用防抖處理的滾動事件處理器
const onScroll = createScrollHandler(loadMoreItems);

function addScrollListener(){
  if(!props.useAutoSearch) return;
  
  nextTick(() => {
    const tableWrapper = dataTable.value.$el.querySelector('.v-table__wrapper');
    if (tableWrapper) {
      tableWrapper.addEventListener('scroll', onScroll);
    } else {
      console.error('Table wrapper not found');
    }
  });
}

onMounted(() => {
  addScrollListener();
});


</script>

<style scoped>
.no-wrap :deep(th) {
  white-space: nowrap;
}

.custom-data-table {
  border: 1px solid gray ;
  box-shadow: none ;
}

.custom-data-table :deep(.v-data-table-header__content) {
  font-size: 16px ;
  color: black ;
}
</style>
