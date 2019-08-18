// 导入axios,设置axios基地址和cookie问题
import axios from "axios"

// axios.defaults.withCredentials = true
// axios.defaults.baseURL= "http://localhost:8888/api/private/v1/"
// 用名字暴露
const http = axios.create({
  baseURL: "http://localhost:8888/api/private/v1/"
})

export default http;

// axios请求拦截
http.interceptors.request.use(function (config) {
  // 发请求前调用
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
}, function (error) {
  // Do something with request error
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

// 操作1:编辑用户(先渲染然后再提交)
export const editUser = ({ id, email, mobile }) => {
  return http.put(`users/${id}`, {
    email,
    mobile
  })
}

// 操作2: 删除用户
export const delUser = (id) => {
  return http.delete(`users/${id}`)
}

// 操作3:修改角色信息之 获取所有角色列表
export const getAllRoles = () => {
  return http.get('roles')
}

// 操作3: 修改用户角色
export const changeRole = ({ id, rid }) => {
  return http.put(`users/${id}/role`, {
    rid
  })
}

// 获取所有权限列表{
export const getRightList = (type) => {
  return http.get(`rights/${type}`)
}