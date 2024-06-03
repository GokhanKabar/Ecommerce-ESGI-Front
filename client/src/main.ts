import './assets/main.css'

import { createApp } from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import './styles/app.css' // Here
import router from './router'
import store from '@/store/store'
// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Components
const vuetify = createVuetify({
  components,
  directives
})

const app = createApp(App)
app.use(router)
app.use(Vuex)
app.use(vuetify)
app.use(store)
app.mount('#app')
