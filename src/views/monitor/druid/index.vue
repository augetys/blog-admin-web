<template>
  <div id="app">
    <iframe
      style="border:none"
      :width="searchTableWidth"
      :height="searchTableHeight"
      :src="reportUrl"
    />
  </div>
</template>
<script>

export default {
  data() {
    return {
      reportUrl: '',
      searchTableHeight: 0,
      searchTableWidth: 0,
      druidUrl: '/druid/login.html'
    }
  },
  mounted() {
    window.onresize = () => {
      this.widthHeight() // 自适应高宽度
    }
    this.$nextTick(function() {
      this.widthHeight()
    })
  },
  created() {
    // 从路由里动态获取 url地址   具体地址看libs下util.js里的 backendMenuToRoute  方法
    this.reportUrl = process.env.VUE_APP_BASE_API + this.druidUrl
  },
  methods: {
    widthHeight() {
      this.searchTableHeight = window.innerHeight
      this.searchTableWidth = window.innerWidth - 220
    }
  }
}
</script>
