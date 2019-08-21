<template>
  <div>
    <bread first="商品管理" second="商品列表"></bread>

    <!-- 输入框 -->
    <!-- layout布局 -->
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>

      <!-- 添加用户按钮 -->
      <el-col :span="18">
        <el-button type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="600px"></el-table-column>
      <el-table-column property="goods_price" label="商品价格(元)" width="120px"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量" width="120px"></el-table-column>
      <el-table-column label="创建时间" width="200px">
        <template slot-scope="scope">{{ scope.row.add_time | formatTime }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchParams.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import moment from "moment";
import { goodList } from "../../API/http";

export default {
  name: "goods",
  data() {
    return {
      total: 400,
      // 发获取商品列表的请求,参数的集合地
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 发请求获取数据,赋值到这里
      tableData: []
    };
  },
  created() {
    // 页面一打开就显示表格的商品数据
    this.getGoodList();
  },

  methods: {
    // 页码改变事件
    handleCurrentChange(page) {
      // 里面的参数是被点击的页码
      this.searchParams.pagenum = page;
      this.getGoodList();
    },
    // 页容量改变事件
    handleSizeChange(size) {
      this.searchParams.pagesize = size;
      this.searchParams.pagenum = 1;
      this.getGoodList();
    },
    // 获取所有商品列表的请求,封装成函数
    getGoodList() {
      goodList(this.searchParams).then(res => {
        // console.log(res);
        this.tableData = res.data.data.goods;
        this.total = res.data.data.total;
      });
    }
  },
  filters: {
    // 时间戳的格式转换事件(过滤器)
    formatTime(val) {
　　　　return moment.unix(val).format("YYYY-MM-DD HH:mm:ss")
　　}
  }
};
</script>

<style lang="less" scoped>
</style>