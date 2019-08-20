// 导入vue
import Vue from "vue"

// 导入路由
import VueRouter from "vue-router"
// use一下
Vue.use(VueRouter)

// 导入组件
import login from "../views/01.login.vue"
import index from "../views/02.index.vue"
import userlist from "../views/03.userlist.vue"
import rightlist from "../views/04.rightlist.vue"
import rolelist from "../views/05.rolelist.vue"
import goodlist from "../views/06.goodlist.vue"

// 路由规则
const routes = [
  { path: "/login", component: login },
  {
    path: "/index", component: index,
    children: [
      { path: "/users", component: userlist },
      { path: "/rights", component: rightlist },
      { path: "/roles", component: rolelist },
      { path: "/goods", component: goodlist },
    ]
  },

  // 重定向
  { path: "", redirect: "/login" },

]


// 创建路由对象
const router = new VueRouter({
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  if (to.path.indexOf('index') != -1) {
    if (window.localStorage.getItem('token')) {
      next();
    } else {
      // 提示请先登录并且跳转到登录页
      Vue.prototype.$message.error('请先登录')
      router.push('login')
    }
  } else {
    next()
  }
})

// 把路由暴露出去
export default router



