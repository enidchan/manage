<template>
  <div>
    <bread first="商品管理" second="商品列表"></bread>

    <!-- 输入框 -->
    <!-- layout布局 -->
    <el-col :span="6">
      <el-input placeholder="请输入内容" v-model.trim="" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <!-- 添加用户按钮 -->
    <el-col :span="18">
      <el-button @click="" type="success" plain>添加商品</el-button>
    </el-col>
  </div>
</template>

<script>
export default {
  name:"goods",
  data() {
    return {
      
    }
  },
  


};
</script>

<style>
</style>