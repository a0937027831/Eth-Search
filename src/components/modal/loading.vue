<template>
  <div class="text-center">
    <v-overlay
      v-model="loadingStore.isLoading"
      class="flex align-center justify-center"
      persistent
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import { useLoadingStore } from '@/stores/loading';

  const loadingStore = useLoadingStore();
</script>

<style lang="scss">
.full-page{
  position: absolute;
}
</style>