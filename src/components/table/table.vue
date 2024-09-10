<template>
  <v-data-table
    ref="dataTable"
    v-bind="$attrs"
    class="no-wrap custom-data-table"
    :headers="headers"
    :items="items"
    fixed-header
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
  
<style scoped lang="scss">
.no-wrap :deep(th) {
  white-space: nowrap;
}

.custom-data-table {
  border: 1px solid #ccc;
  box-shadow: none ;
}


// old css
// .save-graph-table {
//   width: 100%;
//   border: 1px solid #ccc;
//   height: 250px;
//   overflow: auto;
// }
// .save-graph-table thead, .save-graph-table tr:not(:last-child) {
//   border-bottom: 1px solid #ccc;
// }
// .save-graph-table table {
//   width: 100%;
// }
// .save-graph-table thead {
//   position: sticky;
//   top: 0;
//   background: #fff;
//   font-weight: 600;
// }
// .save-graph-table th, .save-graph-table td {
//   padding: 1em;
//   height: 50px;
// }
// .save-graph-table tbody tr:hover {
//   background: #FAFAFA;
// }
// .save-graph-table tbody tr td {
//   color: pointer !important;
// }
// .save-graph-table tbody tr.active {
//   background: #F1F9FF;
// }
</style>
  