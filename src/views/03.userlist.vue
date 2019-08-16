<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my_bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 输入框 -->
    <!-- layout布局 -->
    <el-col :span="6">
      <el-input @input="getTotalUsers" placeholder="请输入内容" v-model.trim="searchParams.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>

    <!-- 添加用户按钮 -->
    <el-col :span="18">
      <el-button type="success" plain>添加用户</el-button>
    </el-col>

    <!-- 表格 -->
    <el-table :data="tableData" @current-change="handleCurrentChange" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名"></el-table-column>
      <el-table-column property="email" label="邮箱"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>

      <el-table-column label="用户状态">
      <!-- switch开关 用自定义列包裹起来-->
        <template slot-scope="scope">
          <!-- scope.row是要绑定的数据, 自定义列的template和绑定v-model两者缺一不可 -->
           <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" plain></el-button>
          <el-button type="warning" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchParams.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="searchParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { users } from "../API/http";
export default {
  data() {
    return {
      // 表格数据(必须是数组,才会被内部的v-for执行解析出来)
      tableData: [],
      // 数据总数
      total: 0,
      // 设置查询用户列表的参数
      searchParams: {
        query: "",
        pagenum: 1, //当前页
        pagesize: 5 //页容量
      }
    }; 
  },
  created() {
    // 发请求
    this.getUsers();
  },
  methods: {

    // 封装获取用户信息
    getUsers(){
      // 做一下判断,假设输入框输入参数的话,就让当前页为1
      // if(this.searchParams.query!=""){
      //   this.searchParams.pagenum = 1
      // }
      users(this.searchParams).then(res => {
      // console.log(res);
      this.tableData = res.data.data.users;
      this.total = res.data.data.total;
      })
    },
    // 获取全部数据时封装的方法
    getTotalUsers(){
      // 做一下判断,假设输入框输入参数的话,就让当前页为1
      if(this.searchParams.query!=""){
        this.searchParams.pagenum = 1
      }
      this.getUsers();
    },
    // 页码改变事件
    handleCurrentChange(page){
      // alert(page);
      // 让你点击的页码为当前页
      this.searchParams.pagenum = page;
      // 发请求获取用户列表
      this.getUsers();
    },
    // 页容量改变事件
    handleSizeChange(size){
      // alert(size)
      this.searchParams.pagesize = size;
      // 让当前页为第一页
      this.searchParams.pagenum = 1;
      // 发请求
      this.getUsers();
    }
  },
};
</script>

<style lang="less">
.my_bread {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  background-color: #d3dce6;
  padding: 0 15px;
}
</style>