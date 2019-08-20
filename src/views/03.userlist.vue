<template>
  <div>
    <!-- 面包屑 -->
    <bread first="用户管理" second="用户列表"></bread>

    <!-- 输入框 -->
    <!-- layout布局 -->
    <el-row>
      <el-col :span="6">
        <el-input
          @input="getTotalUsers"
          placeholder="请输入内容"
          v-model.trim="searchParams.query"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>

      <!-- 添加用户按钮 -->
      <el-col :span="18">
        <el-button @click="addUserVisible=true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 1200px" border>
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column property="username" label="姓名"></el-table-column>
      <el-table-column property="email" label="邮箱"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>

      <el-table-column label="用户状态">
        <!-- switch开关 用自定义列包裹起来-->
        <template slot-scope="scope">
          <!-- scope.row是要绑定的数据, 自定义列的template和绑定v-model两者缺一不可 -->
          <el-switch
            @change="changeUserState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="doEditUser(scope.row)" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="doDelete(scope.row)" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="doChangeRole(scope.row)" type="warning" icon="el-icon-check" plain></el-button>
        </template>
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

    <!-- 添加用户的弹出框 饿了么的对话框-->
    <el-dialog title="添加用户" :visible.sync="addUserVisible">
      <el-form :model="addform" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input type="text" v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input type="password" v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBtn('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 操作1:编辑用户的弹出框 饿了么的dialog对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserVisible">
      <el-form :model="editform" :rules="rules">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input type="text" v-model="editform.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 操作3: 编辑用户角色信息 -->
    <el-dialog title="分配角色" :visible.sync="roleFormVisible">
      <el-form :model="roleform">
        <el-form-item label="当前用户" label-width="100px">
          <span>{{roleform.username}}</span>
        </el-form-item>
        <el-form-item label="请选择角色" label-width="100px">
          <el-select v-model="roleform.rid" placeholder="请选择角色">
            <el-option v-for="item in roleList" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  users,
  addUsers,
  changeStateBtn,
  editUser,
  delUser,
  getAllRoles,
  changeRole
} from "../API/http";
export default {
  name: "userlist",
  data() {
    return {
      // 修改用户角色所需数据
      // 准备一个用来发请求后 拿到的角色列表
      roleList: [],
      roleFormVisible: false,
      // 发请求需要的数据
      roleform: {
        username: "",
        rid: 0,
        id: 0
      },
      // 编辑用户所需数据
      editUserVisible: false,
      editform: {
        username: "",
        email: "",
        mobile: "",
        id: 0
      },
      // 添加用户所需数据
      addUserVisible: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 表单的验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 6,
            message: "用户名在 3 到 6 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "密码在 6 到 13 个字符",
            trigger: "change"
          }
        ]
      },
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

    // 这是操作3: 页面一进来就发请求获取所有用户的角色列表
    // 先发请求 获取所有角色列表渲染到option
    getAllRoles().then(res => {
      // console.log(res);
      this.roleList = res.data.data;
    });
  },
  methods: {
    // 操作3:修改用户角色
    doChangeRole(row) {
      // 遍历roleList
      let rid = 0;
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].roleName == row.role_name) {
          rid = this.roleList[i].id;
        }
      }
      this.roleFormVisible = true;
      this.roleform.username = row.username;
      this.roleform.id = row.id;
      //成功从roleList那里拿到rid
      this.roleform.rid = rid;
    },
    // 修改角色的按钮提交
    submitChangeRole() {
      changeRole(this.roleform).then(res => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
          this.roleFormVisible = false;
          this.getUsers();
        }
      });
    },
    // 操作2: 删除用户
    doDelete(row) {
      // console.log(row)
      // 这里放了饿了么ui的messageBox弹框 确认一下
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          delUser(row.id).then(res => {
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 操作1: 编辑用户状态
    doEditUser(row) {
      this.editUserVisible = true;
      // console.log(row);
      // 根据用户id查询信息,渲染在编辑页面
      this.editform.username = row.username;
      this.editform.email = row.email;
      this.editform.mobile = row.mobile;
      this.editform.id = row.id;
    },
    // 操作1:编辑用户的确定按钮点击事件
    submitEditBtn() {
      // 发请求修改用户信息
      editUser(this.editform).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.getUsers();
          this.$message.success(res.data.meta.msg);
          this.editUserVisible = false;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 用户状态改变switch
    changeUserState(row) {
      // console.log(row);
      // 发请求
      changeStateBtn(row.id, row.mg_state).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 添加用户按钮的点击事件
    submitAddBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发请求去添加用户
          addUsers(this.addform).then(res => {
            // console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success(res.data.meta.msg);
              this.addUserVisible = false;
              this.getUsers();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 封装获取用户信息
    getUsers() {
      // 做一下判断,假设输入框输入参数的话,就让当前页为1
      // if(this.searchParams.query!=""){
      //   this.searchParams.pagenum = 1
      // }
      users(this.searchParams).then(res => {
        // console.log(res);
        this.tableData = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 获取全部数据时封装的方法
    getTotalUsers() {
      // 做一下判断,假设输入框输入参数的话,就让当前页为1
      if (this.searchParams.query != "") {
        this.searchParams.pagenum = 1;
      }
      this.getUsers();
    },
    // 页码改变事件
    handleCurrentChange(page) {
      // alert(page);
      // 让你点击的页码为当前页
      this.searchParams.pagenum = page;
      // 发请求获取用户列表
      this.getUsers();
    },
    // 页容量改变事件
    handleSizeChange(size) {
      // alert(size)
      this.searchParams.pagesize = size;
      // 让当前页为第一页
      this.searchParams.pagenum = 1;
      // 发请求
      this.getUsers();
    }
  }
};
</script>
