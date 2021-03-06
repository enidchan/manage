// 导入axios,设置axios基地址和cookie问题
import axios from "axios"
import Vue from "vue"
import router from '../router/router'

// axios.defaults.withCredentials = true
// axios.defaults.baseURL= "http://localhost:8888/api/private/v1/"
// 用名字暴露
const http = axios.create({
  baseURL: "http://localhost:8888/api/private/v1/"
})

export default http;

// axios请求拦截
http.interceptors.request.use(function (config) {
  // 发请求前做的事
  // 发请求之前把flag改为false
  flag = false;
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 用开关思想解决弹框多次的问题(router.js里有了导航守卫配合meta和token,所以就不用请求拦截)
let flag = false
// 响应拦截
http.interceptors.response.use(function (response) {
  if(flag){
    return response
  }
  // 在这里做判断,response是响应回来的所有数据
  if(response.data.meta.status==400 && response.data.meta.msg=="无效token"){
    Vue.prototype.$message('请先登录!')
    flag = true
    router.push('/login')
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});



// 专门封装一个用来登录的方法
export const login = ({ username, password }) => {
  return http.post('login', {
    username,
    password
  })
}

// 封装获取左右路由权限的方法
export const menus = () => {
  // 需要拿到token
  return http.get('menus')
}

// 封装获取用户信息的方法
export const users = ({ query, pagenum, pagesize }) => {
  return http.get('users', {
    params: {
      query,
      pagenum,
      pagesize
    },
    // headers: {
    //   Authorization: window.localStorage.getItem('token')
    // }
  })
}

// 添加用户
export const addUsers = ({ username, password, email, mobile }) => {
  return http.post('users', {
    username,
    password,
    email,
    mobile
  })
}

// 修改用户状态
export const changeStateBtn = (uid, type) => {
  return http.put(`users/${uid}/state/${type}`)
}

// 编辑用户(先渲染然后再提交)
export const editUser = ({ id, email, mobile }) => {
  return http.put(`users/${id}`, {
    email,
    mobile
  })
}

// 删除用户
export const delUser = (id) => {
  return http.delete(`users/${id}`)
}

// 获取所有角色列表
export const getAllRoles = () => {
  return http.get('roles')
}

// 修改用户角色
export const changeRole = ({ id, rid }) => {
  return http.put(`users/${id}/role`, {
    rid
  })
}

// 获取所有权限列表{
export const getRightList = (type) => {
  return http.get(`rights/${type}`)
}

// 权限列表: 删除角色指定权限
export const delUserRight = (roleId, rightId) => {
  return http.delete(`roles/${roleId}/rights/${rightId}`)
}

// 角色列表:角色授权
export const changeRight = (roleId, rids) => {
  return http.post(`roles/${roleId}/rights`, {
    rids
  })
}

// 角色列表: 编辑角色提交
export const editRole = ({ id, roleName, roleDesc }) => {
  return http.put(`roles/${id}`, {
    roleName,
    roleDesc
  })
}

// 删除角色
export const delRole = (id) => {
  return http.delete(`roles/${id}`)
}

// 添加角色
export const addRole = ({roleName,roleDesc})=>{
  return http.post('roles',{
    roleName,
    roleDesc
  })
}

// 商品列表(get请求带参数的要记得加params)
export const goodList = ({query,pagenum,pagesize})=>{
  return http.get('goods',{
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 获取商品分类
export const categories = (type)=>{
  return http.get('categories',{
    params:{
      type
    }
  })
}