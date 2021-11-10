import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Axios from 'axios';
// @ts-ignore
import VueResizeObserver from "vue-resize-observer";

// optionally import default styles
const app = createApp(App)
app.config.globalProperties.Axios=Axios
app.use(ElementPlus)
app.use(VueResizeObserver)
app.mount('#app')
