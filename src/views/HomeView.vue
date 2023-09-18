<template>
  <div>
    <div style="display: flex">
      <div style="flex: 1;">
        <div style="margin-bottom: 15px; font-weight: bold; font-size: 18px">系统公告</div>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="item in notices" :title="item.name" :name="item.id">
            <div style="padding: 0 20px">{{ item.content }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div style="width: 50px"></div>
      <div style="flex: 1; margin-top: 50px;">
        <!-- 饼图-->
        <div id="pie" style="width: 100%; height: 400px"></div>
      </div>
    </div>
    <div style="display: flex">
      <div style="flex: 1; margin-top: 50px">
        <!-- 柱状图-->
        <div id="bar" style="width: 100%; height: 400px"></div>
      </div>
      <div style="flex: 1; margin-top: 50px">
        <!-- 折线图-->
        <div id="line" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

import * as echarts from "echarts";
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
    this.initEcharts();
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
    },
    initEcharts() {
      request.get("/book/echarts/pie").then(res => {
        if (res.code === '0') {
          // 开始去渲染饼图数据啦
          this.initPie(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      request.get("/book/echarts/bar").then(res => {
        if (res.code === '0') {
          // 开始去渲染柱状图数据啦
          let map = res.data;
          this.initBar(map.xAxis, map.yAxis)
          // 开始去渲染折线图数据啦
          this.initLine(map.xAxis, map.yAxis)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    initPie(data) {
      let chartDom = document.getElementById('pie');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '图书统计（饼图）',
          subtext: '统计维度：图书分类',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '图书分类',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
    initBar(xAxis, yAxis) {
      let chartDom = document.getElementById('bar');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '图书统计（柱状图）',
          subtext: '统计维度：图书分类',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yAxis,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
    initLine(xAxis, yAxis) {
      let chartDom = document.getElementById('line');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: '图书统计（折线图）',
          subtext: '统计维度：图书分类',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yAxis,
            type: 'line'
          }
        ]
      };

      option && myChart.setOption(option);
    }
  }
}
</script>
