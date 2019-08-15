import Vue from 'vue'
import App from './App.vue'

// 1.导入全局base.css
import "./assets/css/base.less"
Vue.config.productionTip = false

// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入封装好的路由
import router from "./router/router"

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
