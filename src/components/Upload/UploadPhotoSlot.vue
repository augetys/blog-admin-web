<template>
  <!--  <div>-->
  <!--    <el-upload-->
  <!--      ref="pictureUpload"-->
  <!--      :action="api"-->
  <!--      list-type="picture-card"-->
  <!--      :auto-upload="false"-->
  <!--      accept="image/jpeg,image/jpg,image/png"-->
  <!--      :before-upload="handleBeforeUpload"-->
  <!--      :headers="importHeaders"-->
  <!--    >-->
  <!--      <i slot="default" class="el-icon-plus" />-->
  <!--      <div slot="file" slot-scope="{file}">-->
  <!--        <img-->
  <!--          class="el-upload-list__item-thumbnail"-->
  <!--          :src="file.url"-->
  <!--          alt=""-->
  <!--        >-->
  <!--        <span class="el-upload-list__item-actions">-->
  <!--          <span-->
  <!--            class="el-upload-list__item-preview"-->
  <!--            @click="handlePictureCardPreview(file)"-->
  <!--          >-->
  <!--            <i class="el-icon-zoom-in" />-->
  <!--          </span>-->
  <!--          <span-->
  <!--            v-if="!disabled"-->
  <!--            class="el-upload-list__item-delete"-->
  <!--            @click="handleDownload(file)"-->
  <!--          >-->
  <!--            <i class="el-icon-download" />-->
  <!--          </span>-->
  <!--          <span-->
  <!--            v-if="!disabled"-->
  <!--            class="el-upload-list__item-delete"-->
  <!--            @click="handleRemove(file)"-->
  <!--          >-->
  <!--            <i class="el-icon-delete" />-->
  <!--          </span>-->
  <!--        </span>-->
  <!--      </div>-->
  <!--    </el-upload>-->
  <!--    <el-form-item>-->
  <!--      <el-button type="primary" size="small" @click="uploadFile">上传<i class="el-icon-upload el-icon&#45;&#45;right" /></el-button>-->
  <!--    </el-form-item>-->
  <!--    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">-->
  <!--      <img width="100%" :src="dialogImageUrl" alt="">-->
  <!--    </el-dialog>-->
  <!--  </div>-->

  <div>
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2M</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadSlot',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      api: process.env.VUE_APP_BASE_API + '/resource/qiniu/file',
      importHeaders: {
        'Authorization': 'Bearer  ' + getToken()
      }
    }
  },
  methods: {
    handleRemove(file) {
      this.$refs.pictureUpload.handleRemove(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleBeforeUpload(file) {
      console.log('before')
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
      const size = file.size / 1024 / 1024 / 2
      if (size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M'
        })
      }
    },
    uploadFile() {
      this.$refs.pictureUpload.submit()
    }
  }
}
</script>

<style scoped>

</style>
