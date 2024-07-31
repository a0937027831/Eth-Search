import XInput from '@/components/form/input.vue'
import XTable from '@/components/table/table.vue'
import XDialog from '@/components/modal/dialog.vue'

export function registerGlobalComponents(app) {
  app.component('XInput', XInput);
  app.component('XTable', XTable);
  app.component('XDialog', XDialog);
}
