<template>
  <div>
    <h1>錢包餘額: {{ account.balance }} ETH</h1>
    <div class="my-4">
      <h2>近期普通交易(近10筆)</h2>
      <XTable
        :headers="normalTransactionHeaders"
        :items="account.normalTransactions" 
        disable-pagination 
        disable-sort 
        hide-default-footer
      >
        <template #item.hash="{ value }">
          <router-link :to="{ name: 'transaction', params: { searchValue: value } }">
            {{ value }}
          </router-link>
        </template>
      </XTable>
    </div>

    <div class="my-4">
      <h2>近期內部交易(近10筆)</h2>
      <XTable 
        :headers="internalTransactionHeaders"
        :items="account.internalTransactions" 
        disable-pagination 
        disable-sort 
        hide-default-footer
      >
        <template #item.hash="{ value }">
          <router-link :to="{ name: 'transaction', params: { searchValue: value } }">
            {{ value }}
          </router-link>
        </template>
        <template #item.value="{ value}">
          {{ weiToEther(value) }}
        </template>
      </XTable>
    </div>
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
import { onBeforeMount, reactive } from "vue";
import { useRoute } from "vue-router";
import { weiToEther } from "@/utils/eth-utils";
import {
  getAccountBalance,
  getNormalTransactionsByAdress,
  getInternalTransactionsByAdress,
} from "@/api/ethersApi";

import { useFlow } from '@/composables/useFlow';
import { useLoadingStore } from '@/stores/loading';


const route = useRoute();
const address = route.params.searchValue;

// pinia
const loadingStore = useLoadingStore();

// account info 
const account = reactive({
  balance: "0",
  normalTransactions: [],
  internalTransactions: [],
});

// table header
const normalTransactionHeaders = [
  { title: "區塊號", key: "blockNumber" },
  { title: "時間戳", key: "timeStamp" },
  { title: "交易哈希", key: "hash" },
  { title: "交易序號", key: "nonce" },
  { title: "區塊哈希", key: "blockHash" },
  { title: "交易索引", key: "transactionIndex" },
  { title: "發送地址", key: "from" },
  { title: "接收地址", key: "to" },
  { title: "Gas", key: "gas" },
  { title: "Gas 價格", key: "gasPrice" },
  { title: "錯誤", key: "isError" },
  { title: "交易狀態", key: "txreceipt_status" },
  { title: "輸入數據", key: "input" },
  { title: "合約地址", key: "contractAddress" },
  { title: "累計 Gas 使用量", key: "cumulativeGasUsed" },
  { title: "Gas 使用量", key: "gasUsed" },
  { title: "確認數", key: "confirmations" },
  { title: "方法 ID", key: "methodId" },
  { title: "函數名稱", key: "functionName" },
];

const internalTransactionHeaders = [
  { title: "交易哈希", key: "hash" },
  { title: "區塊號", key: "blockNumber" },
  { title: "時間戳", key: "timeStamp" },
  { title: "發送地址", key: "from" },
  { title: "接收地址", key: "to" },
  { title: "數量", key: "value" },
];

// dialog
const tipDialog = reactive({
  open: false,
  title: '提示',
  content: '無帳戶地址',
  cancelTxt: '關閉',
})

// flow go
const { executeFlow } = useFlow({ loadingStore, tipDialog });

async function getAccountInfo() {
  await executeFlow({
    checkCondition: () => !!address,
    steps: [
      {
        apiCall: () => getAccountBalance({ address: address, tag: 'latest' }),
        onSuccess: (response) => {
          account.balance = weiToEther(response.result);
        },
      },
      {
        apiCall: () => getNormalTransactionsByAdress({
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 10,
          sort: 'desc',
        }),
        onSuccess: (response) => {
          account.normalTransactions = Array.isArray(response.result)
            ? response.result
            : [];
        },
      },
      {
        apiCall: () => getInternalTransactionsByAdress({
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 10,
          sort: 'desc',
        }),
        onSuccess: (response) => {
          account.internalTransactions = Array.isArray(response.result)
            ? response.result
            : [];
        },
      },
    ],
  });
}

onBeforeMount(() => {
  getAccountInfo();
});

</script>

<style lang="scss" scoped>

</style>
