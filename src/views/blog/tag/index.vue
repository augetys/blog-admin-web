<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="listQuery.name" placeholder="标签名" />
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
        <el-table-column prop="name" label="标签名" align="center" />
        <el-table-column prop="icon" label="标签图标" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
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
      :title="isEdit?'编辑标签':'添加标签'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="tagForm"
        :model="tag"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="标签名称：" prop="name">
          <el-input v-model="tag.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="标签图标：" prop="icon">
          <el-input v-model="tag.icon" style="width: 250px" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="tag.sort" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('tagForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { createTag, deleteTag, getTagList, updateTag } from '@/api/tag'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultTag = {
  id: null,
  name: null,
  sort: null
}

export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      tag: Object.assign({}, defaultTag),
      isEdit: false,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入标签排序', trigger: 'blur' },
          { type: 'number', required: true, message: '排序必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      getTagList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.tag = Object.assign({}, defaultTag)
    },
    getList() {
      this.listLoading = true
      getTagList(this.listQuery).then(response => {
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
    handleDialogConfirm(tagForm) {
      this.$refs[tagForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateTag(this.tag).then(response => {
                if (response.code === 200) {
                  this.$message({
                    type: 'success',
                    message: response.message
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: response.message
                  })
                }
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createTag(this.tag).then(response => {
                if (response.code === 200) {
                  this.$message({
                    type: 'success',
                    message: response.message
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: response.message
                  })
                }
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
      this.tag = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除该标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTag(row.id).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: response.message
            })
          } else {
            this.$message({
              type: 'error',
              message: response.message
            })
          }
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
