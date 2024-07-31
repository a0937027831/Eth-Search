<template>
  <v-card>
    <v-card-title class="my-2">歡迎，使用以太坊網路搜尋工具</v-card-title>
    <v-card class="pa-5">
      <v-card-title class="headline">以太坊搜尋工具</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <XInput 
            v-model="queryInput"
            label="輸入錢包地址或交易哈希" 
            variant="underlined"
            :rules="inputRules" 
            outlined 
            required
          >
          </XInput>
          <v-btn @click="navigator" color="primary">搜尋</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-card>

  <!-- popup -->
  <XDialog 
    v-model="tipDialog.open" 
    :title="tipDialog.title" 
    :content="tipDialog.content" 
    :cancelButtonText="tipDialog.cancelTxt">
  </XDialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const queryInput = ref('');
const route = useRouter();

// check address or hash
const patterns = {
  address: /^0x[a-fA-F0-9]{40}$/,
  transaction: /^0x[a-fA-F0-9]{64}$/
};


// listien query check model
const queryType = ref('');

watch(() => queryInput.value, (newValue) => {
  if (patterns.address.test(newValue)) {
    queryType.value = 'address';
  } else if (patterns.transaction.test(newValue)) {
    queryType.value = 'transaction';
  } else {
    queryType.value = 'invalid';
  }
}, { immediate: true });


// rules
const inputRules = [v => queryType.value != 'invalid' || '請輸入錢包地址或交易哈希'] 

// validate
const form = ref()

async function validate() {
  const { valid } = await form.value.validate()
  return valid;
}

// dialog
const tipDialog = reactive({
  open: false,
  title: '提示',
  content: '請檢查欄位',
  cancelTxt: '關閉',
})

//navigator
async function navigator() {
  let check = await validate();
  if (!check){
    tipDialog.open = true;
    return;
  }

  switch (queryType.value) {
    case 'address':
      route.push({ name: 'account', params: { searchValue: queryInput.value } });
      break;
    case 'transaction':
      route.push({ name: 'transaction', params: { searchValue: queryInput.value } });
      break;
    default:
      break;
  }
}

</script>


<style scoped lang="scss"></style>
