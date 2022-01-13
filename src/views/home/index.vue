<template>
  <!--  https://segmentfault.com/q/1010000007945475-->
  <div>
    <div class="dashboard-container">
      <div class="dashboard-text">{{ soul }} 欢迎你: {{ name }}</div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div v-if="total" class="out-border">
            <div class="layout-title">博客总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.articleCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.tagCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.commentCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.soulCount }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">文章总数</el-col>
                <el-col :span="6" class="overview-item-title">标签总数</el-col>
                <el-col :span="6" class="overview-item-title">评论总数</el-col>
                <el-col :span="6" class="overview-item-title">词条总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="total" class="out-border">
            <div class="layout-title">系统总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.userCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.jobCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.menuCount }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ total.fileCount }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">用户总数</el-col>
                <el-col :span="6" class="overview-item-title">任务总数</el-col>
                <el-col :span="6" class="overview-item-title">菜单总数</el-col>
                <el-col :span="6" class="overview-item-title">文件总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>历史上的今天</span>

            </div>
            <div v-for="(item,index) in history" :key="index" class="text item">
              {{ item.date }}
              {{ item.title }}
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="box-card">
            <div v-if="weather" slot="header" class="clearfix">
              <span>{{ weather.city }}：天气预报</span>
            </div>
            <div v-if="weather" class="weather">
              <el-row :gutter="20">
                <el-col :span="8">
                  <span>天气情况：{{ weather.realtime.info }}</span>
                </el-col>
                <el-col :span="8">
                  <span>温度：{{ weather.realtime.temperature }}</span>
                </el-col>
                <el-col :span="8">
                  <span>湿度：{{ weather.realtime.humidity }}</span>
                </el-col>
                <el-col :span="8">
                  <span>风向：{{ weather.realtime.direct }}</span>
                </el-col>
                <el-col :span="8">
                  <span>风力：{{ weather.realtime.power }}</span>
                </el-col>
                <el-col :span="8">
                  <span>空气质量指数：{{ weather.realtime.aqi }}</span>
                </el-col>
              </el-row>
            </div>

            <div v-if="book" class="book">
              <div v-for="(item,index) in book" :key="index">
                <el-image :src="item.img"></el-image>
                <p>书名：{{ item.title }}</p>
                <p>书籍分类：{{ item.catalog }}</p>
                <p>标签：{{ item.tags}}</p>
                <p>简介：{{ item.sub1}}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>星座运势</span>
            </div>
            <div v-if="constellation" class="constellation">
              <p>星座：{{ constellation.name }}</p>
              <p>综合指数：{{ constellation.all }}</p>
              <p>幸运色：{{ constellation.color }}</p>
              <p>健康指数：{{ constellation.health }}</p>
              <p>爱情指数：{{ constellation.love }}</p>
              <p>财运指数：{{ constellation.money }}</p>
              <p>幸运数字：{{ constellation.number }}</p>
              <p>速配星座：{{ constellation.QFriend }}</p>
              <p>今日概述：{{ constellation.summary }}</p>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>老黄历</span>
            </div>
            <div v-if="day" class="day">
              <p>阳历：{{ day.yangli }}</p>
              <p>阴历：{{ day.yinli }}</p>
              <p>五行：{{ day.wuxing }}</p>
              <p>冲煞：{{ day.chongsha }}</p>
              <p>彭祖百忌：{{ day.baiji }}</p>
              <p>吉神宜趋：{{ day.jishen }}</p>
              <p>宜：{{ day.yi }}</p>
              <p>凶神宜忌：{{ day.xiongshen }}</p>
              <p>忌：{{ day.ji }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getSoul, getWeather, getHistory, getTotal, getDay, getConstellation, getBook } from '@/api/home'

export default {
  name: 'Home',
  data() {
    return {
      soul: null,
      history: [],
      weather: null,
      total: null,
      day: null,
      constellation: null,
      book: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getSoul()
    this.getHistory()
    this.getWeather()
    this.getTotal()
    this.getDay()
    this.getConstellation()
    this.getBook()
  },
  methods: {
    getBook() {
      getBook().then(response => {
        this.book = response.data.result.data
      })
    },
    getDay() {
      getDay().then(response => {
        this.day = response.data.result
      })
    },
    getConstellation() {
      getConstellation().then(response => {
        this.constellation = response.data
      })
    },
    getTotal() {
      getTotal().then(response => {
        this.total = response.data
      })
    },
    getSoul() {
      getSoul().then(response => {
        this.soul = response.data
      })
    },
    getHistory() {
      getHistory().then(response => {
        this.history = response.data.result
      })
    },
    getWeather() {
      getWeather().then(response => {
        this.weather = response.data.result
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .weather .el-col {
    padding-bottom: 10px;
  }

  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 18px;
      color: rgb(64, 158, 255);
    }
  }

  .overview-layout {
    width: 96%;
    margin: 20px auto 0;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

</style>
