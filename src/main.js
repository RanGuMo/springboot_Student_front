import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css'
//导入vxe-table
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)

Vue.config.productionTip = false
Vue.use(ElementUI, { size: "small" }); //统一设置所有element控件的size大小
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
