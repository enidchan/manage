<template>
  <div class="my_login">
    <div class="formBox">
      <h2>用户登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input @keyup.enter.native="submitForm('ruleForm')" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="login_btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from "../API/http";

export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456"
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
      }
    };
  },

  methods: {
    // 验证整个表单是否通过
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发登录请求
          // http.post("login", {
          //   username: this.ruleForm.username,
          //   password: this.ruleForm.password
          // })
          // login要传参数,传入一个对象
          login(this.ruleForm).then(res => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success({
                message:res.data.meta.msg,
                duration:1000
              });
              // 在跳转之前先保存一下token
              window.localStorage.setItem("token",res.data.data.token)
              this.$router.push("/index");
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        } else {
          console.log("error");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.my_login {
  width: 100%;
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;

  .formBox {
    border-radius: 10px;
    background-color: #fff;
    width: 480px;
    height: 400px;
    padding: 60px 60px 0px 60px;

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .login_btn {
      margin-top: 10px;
      width: 100%;
    }
  }
}
</style>