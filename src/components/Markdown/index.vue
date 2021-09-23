<template>
  <div v-loading="isLoading" class="index-page">
    <div id="vditor" class="vditor" :style="vditorClass" />
  </div>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/src/assets/scss/index.scss'
import { getToken } from '@/utils/auth'
export default {
  name: 'MarkdownEditor',
  props: ['height'],
  data() {
    return {
      isLoading: true,
      isMobile: window.innerWidth <= 960,
      vditor: null
    }
  },
  computed: {
    vditorClass: function() {
      return {
        height: this.height + 'px'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const that = this
      this.isLoading = false
      that.initVditor()
    })
  },
  methods: {
    initVditor() {
      const that = this
      const options = {
        width: this.isMobile ? '100%' : '100%',
        height: '0',
        tab: '\t',
        resize: {
          enable: true
        },
        typewriterMode: true,
        mode: 'wysiwyg',
        comment: true,
        preview: {
          delay: 100,
          show: !this.isMobile,
          hljs: {
            'style': 'algol'
          }
        },
        theme: 'classic',
        outline: {
          enable: false,
          position: 'left'
        },
        upload: {
          max: 5 * 1024 * 1024,
          // linkToImgUrl: 'https://sm.ms/api/upload',
          handler(file) {
            const formData = new FormData()
            for (const i in file) {
              formData.append('file', file[i])
            }
            const request = new XMLHttpRequest()
            // 图片上传路径
            request.open('POST', process.env.VUE_APP_BASE_API + '/resource/qiniu/pictures')
            request.setRequestHeader('Authorization', 'Bearer  ' + getToken())
            request.onload = that.onloadCallback
            request.send(formData)
          }
        }
      }
      this.vditor = new Vditor('vditor', options)
      return this.vditor
    },
    onloadCallback(oEvent) {
      const currentTarget = oEvent.currentTarget
      console.log('返回的结果', currentTarget)
      if (currentTarget.status !== 200) {
        return this.$message({
          type: 'error',
          message: currentTarget.status + ' ' + currentTarget.statusText
        })
      }
      const resp = JSON.parse(currentTarget.response)
      console.log(resp)
      let imgMdStr = ''
      // 插入markdown语法  ![avatar](http://baidu.com/pic/doge.png)
      imgMdStr = `![${resp.fileName}](${resp.data})`
      this.vditor.insertValue(imgMdStr)
    },
    // 获取html
    getHtml: function() {
      return this.vditor.getValue()
    },
    setHtml: function(data) {
      // 后端将html转换为markdown后直接渲染
      // DOM现在更新了
      const that = this
      this.$nextTick(() => {
        // DOM现在更新了
        that.initVditor()
        localStorage.setItem('vditorvditor', data)
      })
    },
    // 初始化编辑器，清空markdown和缓存
    initData: function() {
      const that = this
      this.$nextTick(() => {
        if (that.vditor.vditor.lute) {
          that.vditor.setValue('')
          localStorage.setItem('vditorvditor', '')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

