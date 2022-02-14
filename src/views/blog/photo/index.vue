<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="照片描述">
          <el-input v-model.trim="listQuery.tip" placeholder="照片描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleAdd()">添加</el-button>
          <el-button type="primary" plain @click="handleResetSearch()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="tableList" border style="width: 100%">
        <el-table-column label="序号" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column prop="url" label="图片链接" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <el-image :src="scope.row.url" />
              <a
                slot="reference"
                class="el-link--primary"
                style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              >
                {{ scope.row.url }}
              </a>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="tip" label="图片描述" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-clipboard:copy="scope.row.url"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="success"
              size="small"
              icon="el-icon-document-copy"
            >复制地址
            </el-button>
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      layout="total, sizes,prev, pager, next,jumper"
      :current-page.sync="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :page-sizes="[10,50,100]"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="isEdit?'编辑相册':'添加相册'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="photoForm"
        :model="photo"
        label-width="150px"
        size="small"
        :rules="rules"
      >

        <el-form-item v-if="!isEdit" label="文件：" prop="file">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            drag
            :limit="1"
            :before-upload="beforeUpload"
            :action="fileUploadToQiniuApi"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-change="handleChange"
            :data="uploadData"
            :auto-upload="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="相册描述：" prop="tip">
          <el-input v-model="photo.tip" style="width: 350px" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('photoForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { createPhoto, deletePhoto, getPhotoList, updatePhoto } from '@/api/photo'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  tip: null
}
const defaultPhoto = {
  id: null,
  url: null,
  tip: null
}

export default {
  name: 'Index',
  data() {
    return {
      headers: { 'Authorization': 'Bearer  ' + getToken() },
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      photo: Object.assign({}, defaultPhoto),
      isEdit: false,
      dialogVisible: false,
      uploadData: { name: '', bucket: 'hopelittle' },
      rules: {
        tip: [
          { required: true, message: '请输入照片描述', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        file: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadToQiniuApi'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    beforeUpload(file) {
      const size = file.size / 1024 / 1024 < 100
      if (!size) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.$refs['photoForm'].clearValidate('file')
    },
    handleChange(file, fileList) {
      this.$refs['photoForm'].clearValidate('file')
    },
    onSubmit() {
      // 重置分页参数
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      getPhotoList(this.listQuery).then(response => {
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['photoForm'].clearValidate()
      })
      this.photo = Object.assign({}, defaultPhoto)
    },
    getList() {
      this.listLoading = true
      getPhotoList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success('内容已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    handleDialogConfirm(photoForm) {
      this.$refs[photoForm].validateField('tip', (valid) => {
        if (!valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updatePhoto(this.photo).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              // 提交表单前校验是否上传文件
              this.$refs[photoForm].validateField('file')
              this.$refs.uploadFile.submit()
            }
          })
        } else {
          this.$message({
            message: '请填写正确的信息！',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    handleUpdate(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['photoForm'].clearValidate()
      })
      this.photo = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除该相册?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePhoto(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    handleSuccess(response, file, fileList) {
      this.photo.url = response.data.url
      createPhoto(this.photo).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
        this.dialogVisible = false
        this.getList()
      })
      // 上传后清空文件列表
      this.$refs['uploadFile'].clearFiles()
      this.dialogVisible = false
      this.getList()
    },
    handleError(e, file, fileList) {
      Message({
        message: e.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
  }
}
</script>

<style scoped>

</style>
