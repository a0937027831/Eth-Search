<template>
  <v-dialog 
    v-model="modelValue" 
    :max-width="maxWidth" 
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <slot></slot>
        {{ content }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="cancelButtonText" color="red" @click="handleCancel">{{ cancelButtonText }}</v-btn>
        <v-btn v-if="confirmButtonText" color="green" @click="handleConfirm">{{ confirmButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  cancelButtonText: {
    type: String,
    default: '',
  },
  confirmButtonText: {
    type: String,
    default: '',
  },
});

const modelValue = defineModel({
  type: Boolean,
  required: true,
});

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm']);

const maxWidth = ref('600px');


const handleCancel = () => {
  emit('cancel');
  modelValue.value = false;
};

const handleConfirm = () => {
  emit('confirm');
  modelValue.value = false;
};


onMounted(()=>{
  console.log('dialog onMounted')
})

</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
