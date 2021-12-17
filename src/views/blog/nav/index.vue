<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="导航栏名称">
          <el-input v-model="listQuery.name" placeholder="导航栏名称" />
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
        <el-table-column prop="name" label="导航栏名" align="center" />
        <el-table-column prop="icon" label="导航栏图标" align="center" />
        <el-table-column prop="path" label="跳转路由" align="center" show-overflow-tooltip />
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
      :title="isEdit?'编辑导航栏':'添加导航栏'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="navForm"
        :model="nav"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="nav.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <el-input v-model="nav.icon" style="width: 250px" />
        </el-form-item>
        <el-form-item label="跳转路由：" prop="path">
          <el-input v-model="nav.path" style="width: 250px" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="nav.sort" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('navForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { createNav, deleteNav, getNavList, updateNav } from '@/api/nav'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultNav = {
  id: null,
  name: null,
  icon: null,
  sort: null,
  path: null
}

export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      nav: Object.assign({}, defaultNav),
      isEdit: false,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入跳转路由', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入图标', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', required: true, message: '排序必须为数字', trigger: 'blur' },
          { pattern: /^(?:[1-9]\d{0,3}|0)$/, message: '范围在0-9999', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      getNavList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.nav = Object.assign({}, defaultNav)
    },
    getList() {
      this.listLoading = true
      getNavList(this.listQuery).then(response => {
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
    handleDialogConfirm(navForm) {
      this.$refs[navForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateNav(this.nav).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createNav(this.nav).then(response => {
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
      this.nav = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除该导航栏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNav(row.id).then(response => {
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
