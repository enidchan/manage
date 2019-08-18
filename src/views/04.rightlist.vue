<template>
  <div>
    <bread first="权限管理" second="权限列表"></bread>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column property="path" label="路径" width="180"></el-table-column>
      <el-table-column property="level" label="层级" width="180"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getRightList} from "../API/http";

export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    // 发请求获取所有权限列表
    getRightList('list').then(res => {
      console.log(res);
      this.tableData = res.data.data;
      // 把0,1,2 做判断 改成一级,二级,三级
      let list = res.data.data;
      for(let i=0;i<list.length;i++){
        switch(list[i].level){
          case "0":
            list[i].level = "一级";
            break;
          case "1":
            list[i].level = "二级";
            break;
          case "2":
            list[i].level = "三级";
            break;
          default: 
           break;
        }
      }
    });
  }
};
</script>

<style>
</style>