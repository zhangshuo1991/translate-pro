import { createApp } from 'vue'
import App from './App.vue'
import {ElButton,ElCol,ElRow,ElTable,ElDrawer,ElDivider,ElSelect,ElOption,ElInput,ElDialog,ElCollapse,ElCollapseItem,ElForm,ElInputNumber,ElRadioGroup,ElRadio} from 'element-plus'
import 'element-plus/dist/index.css'
import Axios from 'axios';

// optionally import default styles
const app = createApp(App)
app.config.globalProperties.Axios=Axios
app.use(ElButton)
app.use(ElCol)
app.use(ElRow)
app.use(ElTable)
app.use(ElDrawer)
app.use(ElDivider)
app.use(ElSelect)
app.use(ElOption)
app.use(ElInput)
app.use(ElDialog)
app.use(ElCollapse)
app.use(ElCollapseItem)
app.use(ElForm)
app.use(ElInputNumber)
app.use(ElRadioGroup)
app.use(ElRadio)

app.mount('#app')
