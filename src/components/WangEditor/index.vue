<template>
  <div class="home">
    <div id="editor" />
  </div>
</template>
<script>
// 引入 wangEditor
import wangEditor from 'wangeditor'
import { uploadPhotosToQiniu } from '@/api/file'

export default {
  data() {
    return {
      editor: null
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
      editor.config.zIndex = 10
      // 自定义图片上传
      editor.config.customUploadImg = function(files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append('file', files[i], files[i].name)
        }
        uploadPhotosToQiniu(formData, this).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            insert(res.data[i].url)
          }
        })
      }
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
