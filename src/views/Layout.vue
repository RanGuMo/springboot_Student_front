<template>
  <div>
    <el-container>
      <el-header style="background-color: #4c535a">
        <img src="@/assets/logo.png" alt="" style="width: 40px; position: relative; top: 10px;">
        <span style="font-size: 18px; margin-left: 15px; color: white">手拉手带小白做毕设</span>

        <el-dropdown style="float: right; height: 60px; line-height: 60px">
          <span class="el-dropdown-link" style="color: white; font-size: 16px">{{ user.name }}<i
              class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="logout">退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>
    <el-container>
      <el-aside style="overflow: hidden; min-height: 100vh; background-color: #545c64; width: 250px">
        <el-menu :default-active="$route.path" router background-color="#545c64" text-color="#fff"
                 active-text-color="#ffd04b">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="2" v-if="user.role==='ROLE_ADMIN'">
            <template slot="title">
              <i class="el-icon-location"></i><span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin"><i class="el-icon-s-custom"></i><span>管理员信息</span></el-menu-item>
              <el-menu-item index="2-2"> <i class="el-icon-user"></i><span>用户信息</span></el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i><span>信息管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/book">
                <i class="el-icon-info"></i><span>图书管理</span>
                </el-menu-item>
              <el-menu-item index="/type">
                <i class="el-icon-cold-drink"></i><span>分类管理</span>
              </el-menu-item>
              <el-menu-item index="/audit">
                <i class="el-icon-cold-drink"></i><span>请假审核</span>
              </el-menu-item>
              <el-menu-item index="/hotel">
                <i class="el-icon-cold-drink"></i><span>酒店管理</span>
              </el-menu-item>
              <el-menu-item index="/reserve">
                <i class="el-icon-cold-drink"></i><span>酒店预约</span>
              </el-menu-item>
              <el-menu-item index="/log">
                <i class="el-icon-cold-drink"></i><span>日志管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  methods:{
    logout(){
      localStorage.removeItem("user");
      this.$router.push("/login")
    }
  }
}
</script>

<style>
.el-menu {
  border-right: none !important;
}
</style>