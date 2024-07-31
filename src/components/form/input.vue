<template>
  <v-text-field 
    v-bind="$attrs" 
    v-model="computedValue" 
    :label="label" 
    :rules="rules" 
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  rules: {
    type: Array,
    default: [],
  },
  variant: String,
  disabled: Boolean,
  required: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const rules = computed(() => {
  if (props.disabled) return [];
  let rules = [];
  if (props.required) rules.push(checkEmpty);
  rules = [...rules, ...props.rules];
  return rules;
})

const checkEmpty = (value) => { return !!value || "必填" }

</script>