<template>
  <div class="loading-container">
    <v-progress-circular
      color="#0D99FF"
      :size="size"
      :width="width"
      indeterminate
    ></v-progress-circular>

    <span v-if="text" class="text-body-2">{{ text }}</span>
    <slot name="button"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  size: {
    type: [Number, String],
    default: 'large',
  },
  width: {
    type: Number,
    default: 5,
  }
})

const size = computed(() => {
  if (props.size === 'small') {
    return 20
  } else if (props.size === 'medium') {
    return 40
  } else if (props.size === 'large') {
    return 60
  } else {
    return props.size
  }
});

const width = computed(() => {
  if (props.size === 'small') {
    return 3
  } else if (props.size === 'medium') {
    return 4
  } else if (props.size === 'large') {
    return 5
  } else {
    return props.width
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  gap: 1.6em;
}
</style>