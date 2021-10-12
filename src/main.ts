import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Axios from 'axios';

const app = createApp(App)
import VueClipboard from 'vue-clipboard2'
app.config.globalProperties.Axios=Axios
app.use(ElementPlus)
app.use(VueClipboard)
app.mount('#app')
