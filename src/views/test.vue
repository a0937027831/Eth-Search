<template>
  <div>
    <XMultiCheckCascader
      :options="cascaderOptions"
      v-model="selectedValues"
      placeholder="選擇多層項目"
    />
    <p>目前已選：{{ selectedValues }}</p>

    <XMultiCheckCascaderStack
      :options="cascaderOptions"
      v-model="selectedValues2"
      placeholder="選擇多層項目"
      multiple
    />
    <p>目前已選：{{ selectedValues }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedValues = ref([])
const selectedValues2 = ref([])

// 測試用的多層資料
const cascaderOptions = [
  {
    value: 'case1',
    label: '案件 1',
    children: [
      {
        value: 'case_detail1',
        label: '案件 1-1',
        children: [
          { value: 'detail_a', label: '案件 1-1-A' },
          { value: 'detail_b', label: '案件 1-1-B' }
        ]
      },
      {
        value: 'case_detail2',
        label: '案件 1-2'
      }
    ]
  },
  {
    value: 'case2',
    label: '案件 2',
    children: [
      {
        value: 'case_detail3',
        label: '案件 2-1',
        children: [
          {
            value: 'detail_c',
            label: '案件 2-1-C'
          }
        ]
      }
    ]
  },
  {
    value: 'case3',
    label: '案件 3'
  }
]
</script>
