<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="字典名称">
          <el-input v-model.trim="listQuery.name" placeholder="字典名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd()">添加</el-button>
          <el-button type="primary" plain @click="handleResetSearch()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="tableList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="字典名称" align="center">
          <template slot-scope="scope">
            <el-tag type="success" style="cursor: pointer" @click="viewDetails(scope.row)">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
      :title="isEdit?'编辑字典':'添加字典'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="dictForm"
        :model="dict"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="字典名称：" prop="name">
          <el-input v-model="dict.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="dict.description" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('dictForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { createDict, deleteDict, getDictList, updateDict } from '@/api/dict'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultDict = {
  id: null,
  name: null,
  description: null,
  sort: null,
  status: null
}
export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      listLoading: false,
      tableList: [],
      dict: Object.assign({}, defaultDict),
      isEdit: false,
      dialogVisible: false,
      total: null,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      getDictList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getDictList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dictForm'].clearValidate()
      })
      this.isEdit = true
      this.dict = Object.assign({}, row)
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
        this.$refs['dictForm'].clearValidate()
      })
      this.isEdit = false
      this.dict = Object.assign({}, defaultDict)
    },
    handleDialogConfirm(dictForm) {
      this.$refs[dictForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateDict(this.dict).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createDict(this.dict).then(response => {
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
    handleDelete(row) {
      this.$confirm('是否要删除该字典?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    viewDetails(row) {
      this.$router.push({ path: '/sys/dictDetail', query: { dictId: row.id, dictName: row.name }})
    }
  }
}
</script>
