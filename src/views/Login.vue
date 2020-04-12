<template>
  <el-form
    :model="loginForm"
    :rules="rules"
    ref="loginForm"
    v-loading.fullscreen.lock="loading"
    element-loading-text="正在登录"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
    class="loginContainer">
    <h3 class="loginTitle">系统登录</h3>
    <el-form-item size="normal" prop="username">
      <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item size="normal" prop="password">
      <el-input type="text" v-model="loginForm.password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-checkbox class="passwordRem" size="normal" v-model="checked">记住密码</el-checkbox>
    <el-button size="normal" type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
  </el-form>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123',
        },
        rules: {
          username: [{required: true, message: '请输入账号', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        checked: true,
        loading: false
      }
    },
    methods: {
      submitLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
              this.loading = false;
              if (resp) {
                window.sessionStorage.setItem('account', JSON.stringify(resp.obj));
                let path = this.$route.query.redirect;
                // 要加上$符号
                this.$router.replace(path == '/' || path == undefined ? '/home' : path);
              } else {
                this.$message.error('请输入账号和密码！');
                return false;
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .loginContainer {
    width: 350px;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    margin: 180px auto;
    padding: 20px;
    background-clip: border-box;
    background: #ffffff;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle {
    color: #505458;
    text-align: center;
    margin-top: 5px;
  }

  .passwordRem {
    margin-top: 0;
    margin-bottom: 10px;
  }

</style>
