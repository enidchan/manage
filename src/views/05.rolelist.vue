<template>
  <div>
    <bread first="权限管理" second="角色列表"></bread>
    <el-button @click="showAddRole">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" border>
      <!-- 表示箭头可以下拉 -->
      <el-table-column type="expand">
        <!-- 这里用template的插槽语法把三级权限都包起来 -->
        <template slot-scope="scope">
          <el-row v-for="item in scope.row.children">
            <!-- 一级权限,用栅格布局 饿了么的layout布局 -->
            <el-col :span="5">
              <el-tag
                @close="closeMyTag(scope.row.id,item.id,scope.row)"
                closable
              >{{ item.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <!-- 右边的布局 放二级和三级 -->
            <el-col :span="19">
              <!-- 二级权限 -->
              <el-row v-for="level2 in item.children">
                <el-col :span="6">
                  <!-- {{scope.row}}  -->
                  <el-tag
                    @close="closeMyTag(scope.row.id,level2.id,scope.row)"
                    closable
                    type="success"
                  >{{ level2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    @close="closeMyTag(scope.row.id,level3.id,scope.row)"
                    class="my_tag"
                    type="warning"
                    closable
                    v-for="level3 in level2.children"
                  >{{ level3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showEdit(scope.row)" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="showDelRole(scope.row)" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="showTree(scope.row)" type="warning" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框:分配角色 -->
    <el-dialog title="权限分配" :visible.sync="dialogVisible">
      <!-- 这里放tree树形控件 -->
      <el-tree
        :data="data"
        ref="tree"
        :default-expand-all="true"
        show-checkbox
        node-key="id"
        :default-checked-keys="[5]"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeRight(roleId)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的弹出框 饿了么的对话框-->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible">
      <el-form :model="editRoleForm" :rules="rules" ref="roleEdit">
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input type="text" v-model="editRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input
            type="text"
            v-model="editRoleForm.roleDesc"
            autocomplete="off"
            @keyup.enter.native="submitEditRole('roleEdit')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole('roleEdit')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色的弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible">
      <el-form :model="addRoleForm" :rules="rules" ref="roleAdd">
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input type="text" v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input type="text" v-model="addRoleForm.roleDesc" autocomplete="off" @keyup.enter.native="submitAddRole('roleAdd')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole('roleAdd')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoles,
  delUserRight,
  getRightList,
  changeRight,
  editRole,
  delRole,
  addRole
} from "../API/http";

export default {
  name: "roles",
  data() {
    return {
      // 添加角色的数据
      addRoleVisible: false,
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑角色的数据
      editRoleVisible: false,
      editRoleForm: {
        roleName: "",
        roleDesc: "",
        id: 0
      },
      // 编辑对话框中表单的验证规则
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 角色id
      roleId: 0,
      // tree的数据
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      dialogVisible: false,
      tableData: []
    };
  },
  created() {
    // 操作3:权限的分配(难点:树状的节点)
    // 操作3:一进页面就获取tree形的权限列表,准备赋值给data
    getRightList("tree").then(res => {
      // console.log(res);
      this.data = res.data.data;
    });
    // 获取所有角色渲染到表格
    this.getRoles();
  },

  methods: {
    // 添加角色的按钮,显示出弹框
    showAddRole() {
      this.addRoleVisible = true;
      // 显示弹框的时候 把文本框清空
      this.addRoleForm = {};
    },
    // 添加角色的确认按钮
    submitAddRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过验证的话就发请求去修改
          addRole(this.addRoleForm).then(res => {
            // console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success("创建成功!");
              this.getRoles();
            }
          });
          this.addRoleVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 操作2: 删除角色
    showDelRole(row) {
      this.$confirm("确认是否删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认删除的话,就发请求删除
          delRole(row.id).then(res => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000
              });
              // 更新一下数据
              this.getRoles();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            duration: 1000,
            message: "已取消删除"
          });
        });
    },
    // 操作1: 编辑角色: 点击显示出弹框
    showEdit(row) {
      this.editRoleVisible = true;
      // console.log(row)
      this.editRoleForm.roleName = row.roleName;
      this.editRoleForm.roleDesc = row.roleDesc;
      this.editRoleForm.id = row.id;
    },
    // 操作1: 确定按钮的点击事件
    // 整体表单验证通过后 才进行
    submitEditRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过验证的话就发请求去修改
          editRole(this.editRoleForm).then(res => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("修改成功!");
              this.getRoles();
            }
          });

          this.editRoleVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
    // 操作3: 确定按钮 更改权限
    submitChangeRight(roleId) {
      // 通过key获取对应的权限id
      let keys = this.$refs.tree.getCheckedKeys();
      // 再拿到半选的id
      let halfkeys = this.$refs.tree.getHalfCheckedKeys();
      // 拼接两个数组
      let rids = [...keys, ...halfkeys].join(",");
      // console.log(rids);

      // 发请求进行角色授权
      changeRight(roleId, rids).then(res => {
        // console.log(res);

        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
          // 更新数据
          this.getRoles();
        }
      });
      this.dialogVisible = false;
    },
    // 操作3: 点击展示tree
    showTree(row) {
      this.roleId = row.id;
      this.dialogVisible = true;

      // dom更新完毕后展示被选中的权限(即打上勾)
      // 首先,要先获取所有的权限id,放在idList里
      let idList = [];
      // 写法1: 三层for循环
      //  for(let i=0;i<row.children.length;i++){
      //    let level2 = row.children[i].children
      //    for(let j=0;j<level2.length;j++){
      //      let level3 = level2[j].children
      //      for(let k=0;k<level3.length;k++){
      //        idList.push(level3[k].id)
      //      }
      //    }
      //  }
      // 写法2: 递归
      function getRightID(item) {
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            getRightID(item.children[i]);
          }
        } else {
          idList.push(item.id);
        }
      }
      getRightID(row);

      // 然后,在dom更新的时候 渲染出来
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(idList);
      });
    },
    // 删除表格下拉权限的tag 事件
    closeMyTag(roleId, rightId, row) {
      delUserRight(roleId, rightId).then(res => {
        // console.log(res);
        // res.data.data 删除后更新的权限列表
        if (res.data.meta.status == 200) {
          this.$message.success({
            message: "删除成功",
            duration: 1000
          });
          row.children = res.data.data;
        } else {
          this.$message.success(res.data.meta.msg);
        }
      });
    },
    
    // 封装获取所有角色信息的函数
    getRoles() {
      getAllRoles().then(res => {
        // console.log(res);
        this.tableData = res.data.data;
      });
    },
  }
};
</script>

<style lang="less" scoped>
.my_tag {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>