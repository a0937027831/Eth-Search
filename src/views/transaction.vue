<template>
  <div>
    <h1>交易詳情</h1>
    <XTable 
      :headers="headers" 
      :items="transaction"
      disable-pagination 
      disable-sort 
      hide-default-footer
    >
      <template v-slot:item.value="{ item }">
        {{ weiToEther(item.value) }}
      </template>
    </XTable>
  </div>

  <!-- popup -->
  <XDialog 
    v-model="tipDialog.open" 
    :title="tipDialog.title" 
    :content="tipDialog.content" 
    :cancelButtonText="tipDialog.cancelTxt">
  </XDialog>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref,reactive, onBeforeMount } from 'vue';
import { getInternalTransactionsByHash } from "@/api/ethersApi";

import { weiToEther } from "@/utils/eth-utils";
import { useFlow } from '@/composables/useFlow';
import { useLoadingStore } from '@/stores/loading';



const loadingStore = useLoadingStore();

const route = useRoute();
const txhash = route.params.searchValue;

const transaction = ref([]);

// table header
const headers = [
  { title: '區塊號', key: 'blockNumber' },
  { title: '時間戳', key: 'timeStamp' },
  { title: '發送地址', key: 'from' },
  { title: '接收地址', key: 'to' },
  { title: '數量', key: 'key' },
  { title: '合約地址', key: 'contractAddress' },
  { title: 'Gas', key: 'gas' },
  { title: 'Gas 使用量', key: 'gasUsed' },
  { title: '錯誤', key: 'isError' },
  { title: '交易類型', key: 'type' },
  { title: '錯誤代碼', key: 'errCode' },
];

// dialog
const tipDialog = reactive({
  open: false,
  title: '提示',
  content: '無哈希值',
  cancelTxt: '關閉',
})


const { executeFlow } = useFlow({ loadingStore, tipDialog });

async function getTransactionInfo() {
  await executeFlow({
    checkCondition: () => !!txhash,
    steps: [
      {
        apiCall: () => getInternalTransactionsByHash({ txhash: txhash }),
        onSuccess: (response) => {
          transaction.value = Array.isArray(response.result) ? response.result : [];
        },
      },
    ],
  });
}


onBeforeMount(() => {
  getTransactionInfo();
});
</script>
