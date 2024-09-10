<template>
  <XTable
    ref="searchDom"
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer
    items-per-page="-1"
    height="400px"
  >
    <template #loading>
      <!-- <LoadingSpinner :loading="loading" /> -->
    </template>
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
  </XTable>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
// import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useSearchModal } from '@/composables/useSearchModel.js'

const props = defineProps({
  headers: Array,
  items: Array,
  apiFunc: {
    type: Function,
  },
  pageInfo: {
    type: Object,
    default: () => ({
      page: 0,
      totalPage: 0,
      pageSize: 0,
      time: 1
    })
  },
});

// emit
const emit = defineEmits(['setData']);
const setData = ((response)=>{
  emit('setData',response)
})

// search dom
const searchDom = ref();
const searchDomListener = ref();

async function getListenerDom(){
   await nextTick();
   return searchDom.value.$el.querySelector('.v-table__wrapper');
}

const { loading } = useSearchModal(props.pageInfo, props.apiFunc ,setData, searchDomListener)

onMounted( async () => {
  searchDomListener.value = await getListenerDom();
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
