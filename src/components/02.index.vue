<template>
  <el-container class="my_container">
    <!-- 头部 -->
    <el-header class="my_header">
      <img src="../assets/logo.png" alt />
      <h2>黑马后台管理系统</h2>
      <a href="#">退出</a>
    </el-header>

    <el-container class="sub_container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="my_aside">
        <!-- element-ui的导航菜单组件 -->
        <el-menu class="el-menu-vertical-demo" :unique-opened="true" router>

          <el-submenu :index="''+index" v-for="(item,index) in menuList">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="subItem in item.children" :index="subItem.path">
              <i class="el-icon-menu"></i> {{subItem.authName}}
            </el-menu-item>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main class="my_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {menus} from "../API/http"

export default {
  data() {
    return {
      menuList:[]
    }
  },
  created() {
    menus().then(res=>{
      console.log(res);
      this.menuList = res.data.data;
      
    })
  },
};
</script>

<style lang="less" scoped>
.my_container {
  height: 100%;
  .my_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #b3c0d1;
    h2 {
      color: #fff;
    }
    a {
      color: orange;
    }
  }
  .my_aside {
    background-color: #fff;
  }
  .my_main {
    background-color: #e9eef3;
  }
}
</style>