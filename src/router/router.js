// 导入vue
import Vue from "vue"

// 导入路由
import VueRouter from "vue-router"
// use一下
Vue.use(VueRouter)

// 导入组件
import login from "../components/01.login.vue"
import index from "../components/02.index.vue"

// 路由规则
const routes = [
  { path:"/login", component: login },
  { path:"/index", component: index },

  // 重定向
  { path:"", redirect: "/login" },
  
]


// 创建路由对象
const router = new VueRouter({
  routes
})

// 把路由暴露出去
export default router

