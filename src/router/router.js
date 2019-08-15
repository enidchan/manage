// 导入vue
import Vue from "vue"

// 导入路由
import VueRouter from "vue-router"
// use一下
Vue.use(VueRouter)

// 导入组件
import login from "../components/01.login.vue"
import index from "../components/02.index.vue"
import userlist from "../components/userlist.vue"

// 路由规则
const routes = [
  { path:"/login", component: login },
  { path:"/index", component: index,
  children:[
    { path: "users", component: userlist }
  ]
  },

  // 重定向
  { path:"", redirect: "/login" },
  
]


// 创建路由对象
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path.indexOf('index') != -1){
    if(window.localStorage.getItem('token')){
      next();
    }else{
      // 没有token的话就提示未登录并返回login
      Vue.prototype.$message.error('请先登录')
      router.push('/login')
    }
  }else{
    next();
  }
})

// 把路由暴露出去
export default router

