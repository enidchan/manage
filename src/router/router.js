// 导入vue
import Vue from "vue"

// 导入路由
import VueRouter from "vue-router"
// use一下
Vue.use(VueRouter)

// 导入一个请求来验证token的
import { menus } from "../API/http"

// 导入组件
import login from "../views/login.vue"
import index from "../views/index.vue"
import userlist from "../views/01-userManage/userlist.vue"
import rightlist from "../views/02-rightManage/01.rightlist.vue"
import rolelist from "../views/02-rightManage/02.rolelist.vue"
import goodlist from "../views/03-goodsManage/01.goodlist.vue"

// 路由规则
const routes = [
  { path: "/login", component: login },
  {
    path: "/index", component: index,
    children: [
      { path: "/users", component: userlist, meta: { needLogin: true } },
      { path: "/rights", component: rightlist, meta: { needLogin: true } },
      { path: "/roles", component: rolelist, meta: { needLogin: true } },
      { path: "/goods", component: goodlist, meta: { needLogin: true } },
    ]
  },

  // 重定向
  { path: "", redirect: "/login" },

]


// 创建路由对象
const router = new VueRouter({
  routes
})

// 全局导航守卫 (有了响应拦截就可以不用导航守卫)
// router.beforeEach((to, from, next) => {
//   if (to.meta.needLogin) {
//     menus().then(res => {
//       if (res.data.meta.status == 400 && res.data.meta.msg == "无效token") {
//         Vue.prototype.$message('请先登录!')
//         router.push('/login')
//       }else{
//         next()
//       }
//     })
//   } else {
//     next();
//   }

// })

// 把路由暴露出去
export default router



