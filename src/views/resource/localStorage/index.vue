<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model.trim="listQuery.realName" placeholder="文件名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-upload" @click="handleAdd()">上传文件</el-button>
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
        <el-table-column prop="realName" label="文件名" align="center">
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
                {{ scope.row.realName }}
              </a>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="suffix" label="文件类型" align="center" />
        <el-table-column prop="size" label="文件大小" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button v-clipboard:copy="scope.row.url" v-clipboard:success="onCopy" v-clipboard:error="onError" type="success" size="small" icon="el-icon-document-copy">复制地址</el-button>
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
      title="上传文件"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="localStorageForm"
        :model="localStorage"
        label-width="150px"
        size="small"
      >
        <el-form-item v-if="!isEdit" label="文件：" prop="file">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            drag
            :action="filesUploadApi"
            multiple
            :before-upload="beforeUpload"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，支持多文件，且不超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('localStorageForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFileList, deleteFile } from '@/api/file'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  realName: null
}
const defaultLocalStorage = {
  id: null,
  realName: null,
  name: null,
  suffix: null,
  path: null,
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
      localStorage: Object.assign({}, defaultLocalStorage),
      total: null,
      listLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'filesUploadApi'
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
    },
    onSubmit() {
      // 重置分页参数
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      getFileList(this.listQuery).then(response => {
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getFileList(this.listQuery).then(response => {
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
    handleAdd() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['localStorageForm'].clearValidate()
      })
      this.isEdit = false
      this.localStorage = Object.assign({}, defaultLocalStorage)
    },
    handleDialogConfirm(localStorageForm) {
      this.$refs[localStorageForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.uploadFile.submit()
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
    handleDelete(row) {
      this.$confirm('是否要删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile(row.id).then(response => {
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
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success('内容已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    handleError(e, file, fileList) {
      this.$message({
        type: 'error',
        message: '文件上传失败'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
