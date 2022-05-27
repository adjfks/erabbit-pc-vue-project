import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ui from '@/components/library'

// 导入初始化样式
import 'normalize.css'
// 导入公共样式
import '@/assets/styles/common.less'
import './mock'

createApp(App).use(store).use(router).use(ui).mount('#app')
