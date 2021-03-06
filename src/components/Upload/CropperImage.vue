<template>
  <el-dialog
    title="图片裁切"
    class="cropper-dialog"
    :close-on-click-modal="false"
    :visible="dialogVisible"
    center
    :modal-append-to-body="false"
    :modal="false"
    @close="close"
  >
    <div class="cropper-wrap">
      <div
        class="cropper-box"
        :style="cropperStyle"
      >
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="option.info"
          :full="option.full"
          :can-scale="option.canScale"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed="option.fixed"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          :max-img-size="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
        />
      </div>
      <div class="preview-box">
        <div class="preview-title" />
        <input
          ref="upload"
          type="file"
          style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/jpg"
          @change="uploadImg"
        >
        <div
          :style="previewStyle"
          class="preview-img"
        >
          <div :style="preview.div">
            <img
              :style="preview.img"
              :src="preview.url"
            >
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <!--      <el-button size="mini" @click="close">取 消</el-button>-->
      <el-button type="primary" :loading="loading" size="small " @click="upload">选择封面</el-button>
      <!--      <el-button type="danger" :loading="loading" size="small " icon="el-icon-zoom-in" @click="changeScale(1)">放大-->
      <!--      </el-button>-->
      <!--      <el-button type="danger" :loading="loading" size="small " icon="el-icon-zoom-out" @click="changeScale(-1)">缩小-->
      <!--      </el-button>-->
      <el-button type="danger" :loading="loading" size="small " @click="rotateLeft">↺ 左旋转</el-button>
      <el-button type="danger" :loading="loading" size="small " @click="rotateRight">↻ 右旋转</el-button>
      <el-button type="primary" :loading="loading" size="small " icon="el-icon-upload" @click="finish">上传</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'ImageCropper',
  components: {
    VueCropper
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    cropperOption: {
      type: Object,
      default: () => {
      }
    },
    cropperStyle: {
      type: Object,
      default: () => {
      }
    },
    fileSize: {
      type: Number,
      default: 2
    },
    // 裁剪预览图片缩放比例
    zoom: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        full: true, // 是否输出原图比例的截图
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 200, // 默认生成截图框宽度  父组件中去应用
        // autoCropHeight: 150, // 默认生成截图框高度
        canMove: true, // 上传图片是否可以移动
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        height: true,
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        enlarge: 1, // 图片根据截图框输出比例倍数
        mode: 'container', // 图片默认渲染方式
        maxImgSize: 375
      },
      // 防止重复提交
      loading: false,
      preview: {},
      previewStyle: {}
    }
  },
  watch: {
    cropperOption: {
      handler(value) {
        this.option = Object.assign(this.option, value)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    upload() { // 点击上传
      this.$refs.upload.value = null
      this.$refs.upload.click()
    },
    uploadImg(e) { // 上传图片
      const file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error(file.name + '不是图片格式文件')
        return false
      }
      if (file.size > 1024 * 1024 * this.fileSize) { // 图片不大于2M
        this.$message.error(`请上传小于${this.fileSize}M的图片`)
        return false
      }
      const reader = new FileReader()
      // 转化为blob
      reader.readAsArrayBuffer(file)
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.$set(this.option, 'img', data)
      }
    },
    realTime(preview) { // 实时预览
      this.preview = preview
      this.previewStyle = {
        width: preview.w + 'px',
        height: preview.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: this.zoom
      }
    },
    // 将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let len = bstr.length
      const u8arr = new Uint8Array(len)
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 将base64转换为png文件图片
    finish() {
      this.$refs.cropper.getCropData(data => {
        const file = this.dataURLtoFile(data, 'cropper.jpg')
        this.$emit('uploadCropper', file, data)
      })
    },
    close() {
      this.$emit('close')
    },
    // 图片缩放
    // changeScale(num) {
    //   num = num || 1
    //   this.$refs.cropper.changeScale(num)
    // },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    }
  }
}
</script>
<style scoped>
  .cropper-dialog /deep/ .el-dialog {
    width: max-content;
  }

  .cropper-dialog /deep/ .el-dialog__body {
    padding: 20px;
  }

  .cropper-dialog /deep/ .el-button {
    width: 145px;
  }

  .cropper-wrap {
    display: flex;
  }

  .cropper-wrap .cropper-box {
    margin-right: 20px;
    width: 375px;
    height: 176px;
  }

  .cropper-wrap .preview-box .preview-title {
    display: flex;
    min-width: 100px;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    color: #1e2330;
    font-family: PingFangSC-Medium;
  }

  .cropper-wrap .preview-box .preview-title .preveiw-upload {
    color: #0067ED;
    cursor: pointer;
  }

  .cropper-wrap .preview-box .preview-img {
    border-radius: 2px;
  }

  .fun-btn {
    margin-top: 16px;
  }

  .fun-btn i {
    margin-right: 16px;
    font-size: 18px;
    color: #8c8c8c;
    cursor: pointer;
  }

  .fun-btn i:hover {
    color: #0067ED;
  }

  .fun-btn .reUpload {
    margin-right: 16px;
  }
</style>
