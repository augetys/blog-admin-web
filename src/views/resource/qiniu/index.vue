<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="文件名">
          <el-input v-model.trim="listQuery.fileKey" placeholder="文件名" />
        </el-form-item>
        <el-form-item label="bucket名称">
          <el-select
            v-model="listQuery.bucket"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入bucket名称"
          >
            <el-option
              v-for="item in findBucket"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-upload" @click="handleAdd()">上传文件</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="synchronize()">同步文件</el-button>
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
        <el-table-column prop="name" label="文件名" align="center">
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
                {{ scope.row.fileKey }}
              </a>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件备注名" align="center" show-overflow-tooltip />
        <el-table-column prop="bucket" label="Bucket" align="center" />
        <el-table-column prop="type" label="文件类型" align="center" />
        <el-table-column prop="size" label="文件大小" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button v-clipboard:copy="scope.row.url" v-clipboard:success="onCopy" v-clipboard:error="onError" type="success" size="small" icon="el-icon-document-copy">复制地址</el-button>
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
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
      :title="isEdit?'编辑文件':'上传文件'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="qiniuForm"
        :model="qiniu"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="文件备注名：" prop="name">
          <el-input v-model="qiniu.name" style="width: 250px" />
        </el-form-item>

        <el-form-item v-if="!isEdit" label="上传bucket：" prop="bucket">
          <template>
            <el-select v-model="bucket" placeholder="请选择" style="width: 250px">
              <el-option
                v-for="item in findBucket"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-form-item>

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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('qiniuForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { synchronize, getQiniuFileList, deleteQiniuFile, updateQiniuFile, findBucket } from '@/api/file'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  fileKey: null,
  bucket: null
}
const defaultqiniu = {
  id: null,
  name: null,
  fileKey: null,
  bucket: null,
  suffix: null,
  url: null,
  type: null,
  size: null
}

export default {
  name: 'Index',
  data() {
    return {
      headers: { 'Authorization': 'Bearer  ' + getToken() },
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      dialogVisible: false,
      isEdit: false,
      bucket: 'hopelittle',
      findBucket: [],
      qiniu: Object.assign({}, defaultqiniu),
      total: null,
      listLoading: false,
      uploadData: null,
      rules: {
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
    this.getConfig()
  },
  methods: {
    beforeUpload(file) {
      const size = file.size / 1024 / 1024 < 100
      if (!size) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.$refs['qiniuForm'].clearValidate('file')
    },
    handleChange(file, fileList) {
      this.$refs['qiniuForm'].clearValidate('file')
    },
    onSubmit() {
      getQiniuFileList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getQiniuFileList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    getConfig() {
      findBucket().then(response => {
        this.findBucket = response.data
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['qiniuForm'].clearValidate()
      })
      this.isEdit = true
      this.qiniu = Object.assign({}, row)
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
    handleAdd() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['qiniuForm'].clearValidate()
      })
      this.isEdit = false
      this.qiniu = Object.assign({}, defaultqiniu)
    },
    handleDialogConfirm(qiniuForm) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateQiniuFile(this.qiniu).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.dialogVisible = false
            this.getList()
          })
        } else {
          this.uploadData = { name: this.qiniu.name, bucket: this.bucket }
          // 提交表单前校验是否上传文件
          this.$refs[qiniuForm].validateField('file')
          const that = this
          this.$nextTick(() => {
            that.$refs.uploadFile.submit()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('是否要删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQiniuFile(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        // 上传后清空文件列表
        this.$refs['uploadFile'].clearFiles()
        this.dialogVisible = false
        this.getList()
        this.$message({
          type: 'success',
          message: response.message
        })
      } else {
        this.$refs['uploadFile'].clearFiles()
        this.dialogVisible = false
        this.getList()
        this.$message({
          type: 'error',
          message: response.message
        })
      }
    },
    handleError(e, file, fileList) {
      Message({
        message: e.message,
        type: 'error',
        duration: 5 * 1000
      })
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success('内容已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    synchronize() {
      synchronize().then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
