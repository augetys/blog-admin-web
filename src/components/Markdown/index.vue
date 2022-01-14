<template>
  <div v-loading="isLoading" class="index-page">
    <div id="vditor" class="vditor" :style="vditorClass" />
  </div>
</template>

<script>
// https://b3log.org/vditor/
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
        toolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', '|', 'line', 'quote', 'list', 'ordered-list', 'check', 'outdent', 'indent', 'code', 'inline-code', 'insert-after', 'insert-before', 'undo', 'redo', 'upload', 'link', 'table', 'edit-mode', 'both', 'preview', 'fullscreen', 'outline', 'code-theme', 'content-theme', 'export', 'devtools', 'info', 'help'],
        theme: 'classic',
        outline: {
          enable: false,
          position: 'left'
        },
        upload: {
          // linkToImgUrl: 'https://sm.ms/api/upload',
          handler(file) {
            const formData = new FormData()
            formData.append('bucket', 'hopelittle')
            // formData.append('name', 'markdown')
            for (const i in file) {
              formData.append('file', file[i])
            }
            const request = new XMLHttpRequest()
            // 图片上传路径
            request.open('POST', process.env.VUE_APP_BASE_API + '/resource/qiniu/files')
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
      if (currentTarget.status !== 200) {
        return this.$message({
          type: 'error',
          message: currentTarget.status + ' ' + currentTarget.statusText
        })
      }
      const resp = JSON.parse(currentTarget.response)
      const imgList = resp.data
      for (let i = 0; i < imgList.length; i++) {
        let imgMdStr = ''
        // 插入markdown语法  ![avatar](http://baidu.com/pic/doge.png)
        imgMdStr = `![${imgList[i].name}](${imgList[i].url})`
        this.vditor.insertValue(imgMdStr)
      }
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

