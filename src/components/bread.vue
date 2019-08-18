<template>
  <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my_bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{first}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{second}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  // 父组件传值给子组件
  props:["first","second"]
}
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