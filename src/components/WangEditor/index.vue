<template>
  <div class="home">
    <div id="editor" />
  </div>
</template>
<script>
// 引入 wangEditor
import wangEditor from 'wangeditor'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      editor: null,
      editorData: ''
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init()
    })
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    init() {
      // eslint-disable-next-line new-cap
      const editor = new wangEditor(`#editor`)
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml
      }
      // 配置 server 接口地址
      editor.config.uploadFileName = 'file'
      editor.config.uploadImgServer = process.env.VUE_APP_BASE_API + '/qiniu/Upload/wangeditorPhoto'
      editor.config.uploadImgHeaders = {
        Authorization: 'Bearer  ' + getToken()
      }
      // 图片大小限制
      editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      // 图片类型限制
      editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
      // 一次最多上传 5 个图片
      editor.config.uploadImgMaxLength = 5
      // 创建编辑器
      editor.create()
      this.editor = editor
    },
    getHtml() {
      return this.editor.txt.html()
    },
    setHtml(txt) {
      this.editor.txt.html(txt)
    }
  }
}
</script>

<style scoped>

</style>
