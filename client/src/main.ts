import './assets/main.css'

import { createApp } from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import './styles/app.css'; // Here
import router from './router';

import {sync} from 'vuex-router-sync';
import store from '@/store/store';

sync(store, router);
const app = createApp(App)
app.use(router)
app.use(Vuex);
app.use(store);
app.mount('#app')
