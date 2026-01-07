import { createApp } from 'vue'
import App from './App.vue'
import JokerStatePlugin from './plugins/JokerState'

createApp(App).use(JokerStatePlugin).mount('#app')
