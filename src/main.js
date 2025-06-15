import { createApp, markRaw } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.scss'

import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

app.use(router)
app.use(ElementPlus)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.mount('#app')
