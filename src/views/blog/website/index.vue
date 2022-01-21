<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="网址名称">
          <el-input v-model.trim="listQuery.name" placeholder="网址名称" />
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
        <el-table-column prop="name" label="网址名称" align="center" />
        <el-table-column prop="url" label="url" align="center" show-overflow-tooltip />
        <el-table-column prop="category" label="网址类别" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
      :title="isEdit?'编辑网址':'添加网址'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="websiteForm"
        :model="website"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="网站名称：" prop="name">
          <el-input v-model="website.name" style="width: 350px" />
        </el-form-item>

        <el-form-item label="网站地址：" prop="url">
          <el-input v-model="website.url" style="width: 350px" />
        </el-form-item>

        <el-form-item label="网站地址：" prop="category">
          <el-radio-group v-model="website.category">
            <el-radio :label="1">常用网址</el-radio>
            <el-radio :label="2">学习</el-radio>
            <el-radio :label="3">资源</el-radio>
            <el-radio :label="4">影视</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('websiteForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { createWebsite, deleteWebsite, getWebsiteList, updateWebsite } from '@/api/website'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  content: null
}
const defaultWebsite = {
  id: null,
  name: null,
  url: null,
  category: null
}

export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      website: Object.assign({}, defaultWebsite),
      isEdit: false,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入网站名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入网站地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      // 重置分页参数
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      getWebsiteList(this.listQuery).then(response => {
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
        this.$refs['websiteForm'].clearValidate()
      })
      this.website = Object.assign({}, defaultWebsite)
    },
    getList() {
      this.listLoading = true
      getWebsiteList(this.listQuery).then(response => {
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
    handleDialogConfirm(websiteForm) {
      this.$refs[websiteForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateWebsite(this.website).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createWebsite(this.website).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
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
        this.$refs['websiteForm'].clearValidate()
      })
      this.website = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除该网址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWebsite(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
