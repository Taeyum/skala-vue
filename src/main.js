import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Element Plus (기존 Code Challenge 실습용)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// PrimeVue (과제 화면용)
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEUI_LICENSE,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'primevue',
        order: 'primevue, element-plus',
      },
    },
  },
})

app.mount('#app')