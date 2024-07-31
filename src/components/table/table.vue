<template>
  <v-data-table
    v-bind="$attrs"
    class="elevation-1 no-wrap"
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer
  >
  <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
   </template>
  </v-data-table>
</template>

<script setup>
const props = defineProps({
  headers: Array,
  items: Array
});
</script>

<style scoped>
.no-wrap :deep(th) {
  white-space: nowrap;
}
</style>
