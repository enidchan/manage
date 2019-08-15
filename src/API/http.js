// 导入axios,设置axios基地址和cookie问题
import axios from "axios"

// axios.defaults.withCredentials = true
// axios.defaults.baseURL= "http://localhost:8888/api/private/v1/"
// 用名字暴露
const http = axios.create({
  baseURL : "http://localhost:8888/api/private/v1/"
})

export default http;

// 专门封装一个用来登录的方法
export const login = ( { username,password} )=>{
     return http.post('login',{
      username,
      password
    })
}

// 封装获取左右路由权限的方法
export const menus = ()=>{
  // 需要拿到token
   return http.get('menus',{
     headers : {
      //  key :value
       Authorization: window.localStorage.getItem('token')
     }
   })
}


