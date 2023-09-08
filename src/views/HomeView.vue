<template>
  <div>
    <div style="width:50%">
      <div style="font-size: 18px;font-weight: bold;margin-bottom: 20px;">系统公告</div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="item in notices" :title="item.name" :name="item.id">
          <div>{{ item.content }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>


    <!--    <div style="font-size: 18px">欢迎大家跟着武哥一起学习做毕业设计</div>-->
    <!--    <div style="font-size: 18px; color: red; margin: 10px 0">点赞、投币、收藏、好评 + 关注，支持一波</div>-->
    <!--    <div style="font-size: 18px">感谢大家</div>-->
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: 'HomeView',
  data() {
    return {
      activeName: '1',
      notices: []
    };
  },
  mounted() {
    this.findTop3();
  },
  methods: {
    findTop3() {
      request.get("/notice").then(res => {
        if (res.code === '0') {
          this.notices = res.data;
          this.activeName = res.data[0].id;
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
