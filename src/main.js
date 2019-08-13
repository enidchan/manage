import Vue from 'vue'
import App from './App.vue'

// 1.导入全局base.css
import "./assets/css/base.less"

Vue.config.productionTip = false

// 2.导入路由
import VueRouter from "vue-router"
Vue.use(VueRouter);

// 3.导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


// 导入组件
import login from "./components/01.login.vue"

// 路由规则
const routes = [
  { path:"/login", component: login },
  { path:"", redirect: "/login" },
  
]

// 创建路由对象
const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
