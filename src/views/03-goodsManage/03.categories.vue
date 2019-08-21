<template>
  <div>
    <bread first="商品管理" second="商品分类"></bread>
    <el-button type="success" plain>添加商品</el-button>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="cat_name" label="分类名称" sortable width="180"></el-table-column>
      <el-table-column prop="cat_level" label="级别" sortable width="180">
        <template slot-scope="scope">{{ scope.row.cat_level | formatLevel }}</template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? "无效" : "有效"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { categories } from "../../API/http";

export default {
  data() {
    return {
      // 表格绑定的数据
      tableData: [],
    };
  },
  created() {
    categories(3).then(res => {
      console.log(res);
      this.tableData = res.data.data;
    });
  },
  filters: {
    formatLevel(val) {
      switch (val) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
      }
    }
  }
};
</script>

<style>
</style>