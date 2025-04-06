<template>
  <div class="table-wrapper">
    <div class="top-block">
      <slot name="top"></slot>
    </div>

    <div ref="tableBlock" class="table-block">
      <!-- 傳遞 tableBlock 與 teleportId 給子組件 -->
      <slot name="table" :tableBlock="tableBlock" :teleportId="teleportId"></slot>
      <!-- 使用動態產生的 teleportId -->
      <div :id="teleportId" class="teleport-container"></div>
    </div>

    <div class="pagination-block">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  topHeight: {
    type: String,
    default: '15%'
  },
  tableHeight: {
    type: String,
    default: '70%'
  },
  paginationHeight: {
    type: String,
    default: '15%'
  },
});

const wrapperStyles = computed(() => ({
  '--top-height': props.topHeight,
  '--table-height': props.tableHeight,
  '--pagination-height': props.paginationHeight
}));

// 產生一個唯一的 teleportId
const teleportId = 'teleport-container-' + Math.random().toString(36).substr(2, 9);
const tableBlock = ref(null);
</script>

<style scoped lang="scss">
.table-wrapper {
  height: calc(100vh - 47px);
  padding: 0 40px;
  background: #f8f8f8;
}

.top-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: v-bind('wrapperStyles["--top-height"]');
}

.table-block {
  height: v-bind('wrapperStyles["--table-height"]');
  position: relative;
}

.pagination-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: v-bind('wrapperStyles["--pagination-height"]');
}

:deep(.table-wrapper-title) {
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 0;
  font-size: 30px;
}
</style>
