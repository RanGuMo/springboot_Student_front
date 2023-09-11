<template>
  <div class="container">
    <div
        style="width: 450px; height: 350px; margin: 150px auto; background-color:rgba(107,149,224,0.5); border-radius: 10px">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #4a5ed0">
        欢迎登录
      </div>
      <div style="margin-top: 25px; text-align: center; height: 320px;">
        <el-form :model="admin">
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" style="width: 80%"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="admin.password" show-password prefix-icon="el-icon-lock" style="width: 80%"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <!--验证码-->
          <el-form-item>
            <div style="display: flex; justify-content: center">
              <el-input v-model="admin.verCode" prefix-icon="el-icon-s-opportunity" style="width: 42%; margin-right: 10px"
                        placeholder="请输入验证码"></el-input>
              <img :src="captchaUrl" @click="clickImg()" width="36%" height="33px"/>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button style="width: 80%; margin-top: 10px" type="primary" @click="login()" size="default">登录
            </el-button>
          </el-form-item>
          <div style="text-align: center">
            未有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="$router.push('/register')">点击注册</a>
          </div>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "login",
  data() {
    return {
      admin: {},
      key:'',
      captchaUrl:''
    }
  },
  mounted() {
    this.clickImg();
  },
  methods: {
    //点击验证码图片，切换验证码
    clickImg(){
      this.key = Math.random();
      this.captchaUrl="http://localhost:9528/api/captcha?key="+this.key;
    },
    login() {
      request.post("/admin/login?key="+this.key, this.admin).then(res => {
        if (res.code === '0') {
          this.$message.success("登录成功")
          localStorage.setItem("user", JSON.stringify(res.data))
          this.$router.push("/");
        } else {
          this.$message.error(res.msg);
        //  验证码不正确就更换验证码
          this.clickImg();
          this.admin.verCode = '';
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  overflow: hidden;
  height: 100vh;
  background: url("@/assets/1.png");
  background-size: cover;
}
</style>