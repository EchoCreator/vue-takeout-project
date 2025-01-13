<script setup>
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  getTurnoverService,
  getUserGenderService,
  getUserAgeService,
} from "@/api/data.js";

const activeName = ref("1");

const getDate = (minusDay) => {
  const today = new Date();
  const newDay = new Date(today); // 创建一个当前日期的副本
  newDay.setDate(today.getDate() - minusDay);

  const year = newDay.getFullYear();
  const month = String(newDay.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并补零
  const day = String(newDay.getDate()).padStart(2, "0"); // 补零

  return `${year}-${month}-${day}`;
};

// 营业额
const turnover = ref({});
const getTurnover = async (minusDay) => {
  const begin = getDate(minusDay);
  const end = getDate(0);

  const result = await getTurnoverService(begin, end);
  if (result.code === 0) {
    turnover.value = result.data;
    showTurnoverEcharts();
  }
};

const turnoverChartDom = ref(null);
let turnoverChartInstance = null;
const showTurnoverEcharts = () => {
  turnoverChartInstance = echarts.init(turnoverChartDom.value);
  // ECharts的配置项，可以根据需要绘制不同类型的图表
  const option = {
    title: {
      text: "营业额统计",
    },
    xAxis: {
      data: turnover.value.date,
      axisLabel: {
        show: true,
        interval: 0, //使x轴文字显示全
      },
    },
    yAxis: {},
    series: [
      {
        type: "line", // 这里可以是'line'、'bar'、'pie'等，根据图表类型选择
        data: turnover.value.amount,
        label: {
          show: true,
          position: "top",
          textStyle: {
            fontSize: 12,
          },
        },
      },
    ],
  };
  turnoverChartInstance.setOption(option);
};

// 用户性别画像
const userGender = ref({});
const getUserGender = async (minusDay) => {
  const begin = getDate(minusDay);
  const end = getDate(0);

  const result = await getUserGenderService(begin, end);
  if (result.code === 0) {
    userGender.value = result.data;
    showGenderEcharts();
  }
};

const genderChartDom = ref(null);
let genderChartInstance = null;
const showGenderEcharts = () => {
  genderChartInstance = echarts.init(genderChartDom.value);
  // ECharts的配置项，可以根据需要绘制不同类型的图表
  const option = {
    title: {
      text: "用户性别画像",
    },
    color: ["#88abda", "#ec9397"],
    series: [
      {
        type: "pie", // 这里可以是'line'、'bar'、'pie'等，根据图表类型选择
        label: {
          normal: {
            formatter: "{b}（{d}%）",
            textStyle: {
              fontWeight: "normal",
              fontSize: 15,
            },
          },
        },
        data: [
          {
            value: userGender.value[0],
            name: "男",
          },
          {
            value: userGender.value[1],
            name: "女",
          },
        ],
        radius: ['40%', '70%']
      },
    ],
  };
  genderChartInstance.setOption(option);
};

// 用户年龄画像
const userAge = ref({});
const getUserAge = async (minusDay) => {
  const begin = getDate(minusDay);
  const end = getDate(0);

  const result = await getUserAgeService(begin, end);
  if (result.code === 0) {
    console.log(result.data);

    userAge.value = result.data;
    showAgeEcharts();
  }
};

const ageChartDom = ref(null);
let ageChartInstance = null;
const showAgeEcharts = () => {
  genderChartInstance = echarts.init(ageChartDom.value);
  // ECharts的配置项，可以根据需要绘制不同类型的图表
  const option = {
    title: {
      text: "用户年龄画像",
    },
    color: ["#b8dbb3", "#e29135","#b7b7eb"],
    series: [
      {
        type: "pie", // 这里可以是'line'、'bar'、'pie'等，根据图表类型选择
        label: {
          normal: {
            formatter: "{b}（{d}%）",
            textStyle: {
              fontWeight: "normal",
              fontSize: 15,
            },
          },
        },
        data: [
          {
            value: userAge.value[0],
            name: "18岁以下",
          },
          {
            value: userAge.value[1],
            name: "18-30岁",
          },
          {
            value: userAge.value[2],
            name: "30岁以上",
          },
        ],
        radius: ['40%', '70%']
      },
    ],
  };
  genderChartInstance.setOption(option);
};

// 初始化ECharts实例并设置配置项
onMounted(async () => {
  const minusDay = 7 - 1;
  getTurnover(minusDay);
  getUserGender(minusDay);
  getUserAge(minusDay);
});

// 销毁ECharts实例
onUnmounted(() => {
  if (turnoverChartInstance != null && turnoverChartInstance.dispose) {
    turnoverChartInstance.dispose();
  }
  if (genderChartInstance != null && genderChartInstance.dispose) {
    genderChartInstance.dispose();
  }
  if (ageChartInstance != null && ageChartInstance.dispose) {
    ageChartInstance.dispose();
  }
});

const handleChange = () => {
  let minusDay;
  if (activeName.value === "1") {
    minusDay = 7 - 1;
  } else if (activeName.value === "2") {
    minusDay = 30 - 1;
  } else if (activeName.value === "3") {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 获取今天是星期几（0代表星期日，1代表星期一，...，6代表星期六）
    // 计算距离本周星期一的天数（如果今天是星期一，则为0）
    minusDay = (dayOfWeek <= 0 ? 7 : dayOfWeek) - 1;
  } else if (activeName.value === "4") {
    const today = new Date();
    minusDay = today.getDate() - 1;
  }
  getTurnover(minusDay);
  getUserGender(minusDay);
  getUserAge(minusDay);
};
</script>

<template>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
    @tab-change="handleChange"
  >
    <el-tab-pane label="近7天" name="1"></el-tab-pane>
    <el-tab-pane label="近30天" name="2"> </el-tab-pane>
    <el-tab-pane label="本周" name="3"></el-tab-pane>
    <el-tab-pane label="本月" name="4"></el-tab-pane>
  </el-tabs>
  <div class="chart-container">
    <div ref="turnoverChartDom" style="width: 100%; height: 400px"></div>
    <div ref="genderChartDom" style="width: 50%; height: 400px"></div>
    <div ref="ageChartDom" style="width: 50%; height: 400px"></div>
  </div>
</template>

<style scoped>
.chart-container{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
