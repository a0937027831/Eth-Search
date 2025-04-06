<template>
  <v-data-table
    ref="dataTable"
    class="no-wrap custom-data-table border-0"
    align="start"
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :no-data-text="noDataText"
    :loading="loading"
    :hover="hover"
    fixed-header
    hide-default-footer
    disable-sort
  > 
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>

    <!-- 使用單一 Teleport 處理 loading 與 no-data 狀態 -->
    <template #loading>
      {{ teleportReady }}
      <Teleport v-if="teleportReady" :to="computedTeleportTarget">
        <div v-if="loading" class="loading-container">
          <XLoadingCircle :size="loadingSize" :text="loadingText" />
        </div>
      </Teleport>
      <div v-else>
        <div v-if="loading" class="loading-container">
          <XLoadingCircle :size="loadingSize" :text="loadingText" />
        </div>
      </div>
    </template>
    <template #no-data>
      <Teleport v-if="teleportReady" :to="computedTeleportTarget">
        <div class="no-match-text-container">
          <span class="no-match-text">{{ noDataText }}</span>
          <slot name="no-data-button"></slot>
        </div>
      </Teleport>
      <div v-else>
        <div class="no-match-text-container">
          <span class="no-match-text">{{ noDataText }}</span>
          <slot name="no-data-button"></slot>
        </div>
      </div>
    </template>
    <!-- 移除獨立的 no-data 插槽 -->
  </v-data-table>
</template>
  
<script setup>
import XLoadingCircle from '@/viewsComponent/LoadingCircle.vue';
import { computed, onMounted, ref, nextTick, onUnmounted } from 'vue';
import { Teleport } from 'vue';

const props = defineProps({
  headers: Array,
  items: Array,
  noDataText: String,
  // teleportTo 改為用 teleportId 傳入（如果需要也可支援原本的邏輯）
  teleportId: {
    type: String,
    default: '',
  },
  loadingText: String,
  headerHeight: {
    type: Number,
    default: 56,
  },
  rowHeight: {
    type: Number,
    default: 50,
  },
  hover: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingSize: {
    type: String,
    default: 'large',
  },
  itemsPerPage: {
    type: Number,
    default: -1,
  },
});

const tableStyles = computed(() => ({
  '--row-height': `${props.rowHeight}px`,
  '--header-height': `${props.headerHeight}px`
}));

const hover = computed(() => {
  return props.hover && !props.loading && props.items.length > 0;
});

// 控制 Teleport 是否啟用
const teleportReady = ref(false);
onMounted(async() => {
  await nextTick();
  teleportReady.value = true;
});

const computedTeleportTarget = computed(() => {
  // 根據從 TableWrapper.vue 傳入的 teleportId
  return props.teleportId ? `#${props.teleportId}` : '';
});

onUnmounted(() => {
  console.log("table onUnmounted")
});
</script>
  
<style scoped lang="scss">
.no-wrap :deep(th) {
  white-space: nowrap;
}
.custom-data-table {
  border: 1px solid #ccc;
  box-shadow: none;
  white-space: nowrap;
  font-weight: 500;
  height: 100%;
}
.custom-data-table :deep(.v-data-table-progress__loader) {
  display: none;
}
.custom-data-table :deep(tbody) {
  position: relative;
}
.custom-data-table :deep(thead tr th) {
  height: v-bind('tableStyles["--header-height"]') !important;
}
.custom-data-table :deep(tbody tr td) {
  height: v-bind('tableStyles["--row-height"]') !important;
}
.custom-data-table :deep(tbody tr td) {
  text-align: left;
}
.custom-data-table :deep(tbody tr td .tag) {
  background: #f8f8f8;
  padding: 8px;
  border-radius: 8px;
  color: #61646B;
}
.loading-container, .no-match-text-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.no-match-text {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #aaa;
}
</style>
