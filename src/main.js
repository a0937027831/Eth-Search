import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import { registerGlobalComponents } from '@/define/define-global-component.js'

const pinia = createPinia()
const app = createApp(App)


app.use(pinia)
app.use(router)
app.use(vuetify);
registerGlobalComponents(app)

app.mount('#app')
