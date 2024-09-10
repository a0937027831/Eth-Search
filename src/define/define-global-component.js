import XInput from '@/components/form/input.vue'
import XTable from '@/components/table/table.vue'
import XSearchTable from '@/components/table/searchTable.vue'
import XDialog from '@/components/modal/dialog.vue'

export function registerGlobalComponents(app) {
  app.component('XInput', XInput);
  app.component('XTable', XTable);
  app.component('XSearchTable',XSearchTable)
  app.component('XDialog', XDialog);
}
