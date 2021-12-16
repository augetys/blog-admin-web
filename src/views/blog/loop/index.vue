<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="轮播图标题">
          <el-input v-model="listQuery.name" placeholder="轮播图标题" />
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
        <el-table-column prop="title" label="轮播图标题" align="center" />
        <el-table-column prop="isLink" label="是否外链" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isLink"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column prop="targetUrl" label="跳转地址" align="center" show-overflow-tooltip />
        <el-table-column prop="imageUrl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" style="width: 50px;height: 50px" alt="图片">
          </template>
        </el-table-column>
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
      :title="isEdit?'编辑轮播图':'添加轮播图'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="loopForm"
        :model="loop"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="loop.title" style="width: 250px" />
        </el-form-item>

        <el-form-item label="图片：" prop="imageUrl">
          <el-input v-model="loop.imageUrl" style="width: 250px" />
        </el-form-item>

        <el-form-item prop="isLink" label="是否外链：">
          <el-radio-group v-model="loop.isLink">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跳转地址：" prop="targetUrl">
          <el-input v-model="loop.targetUrl" style="width: 250px" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="loop.sort" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('loopForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createLoop, deleteLoop, getLoopList, updateLoop } from '@/api/loop'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultLoop = {
  id: null,
  title: null,
  sort: null,
  isLink: null,
  targetUrl: null,
  imageUrl: null
}

export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      loop: Object.assign({}, defaultLoop),
      isEdit: false,
      dialogVisible: false,
      rules: {
        isLink: [
          { required: true, message: '请选择是否外链', trigger: 'blur' }
        ],
        targetUrl: [
          { required: true, message: '请输入跳转地址', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请输入图片地址', trigger: 'blur' },
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
      getLoopList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.loop = Object.assign({}, defaultLoop)
    },
    getList() {
      this.listLoading = true
      getLoopList(this.listQuery).then(response => {
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
    handleDialogConfirm(loopForm) {
      this.$refs[loopForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateLoop(this.loop).then(response => {
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
              createLoop(this.loop).then(response => {
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
      this.loop = Object.assign({}, row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除该轮播?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLoop(row.id).then(response => {
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

<style>
  /*对公共组件样式修改，未加上scoped*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 595px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }

  .avatar {
    width: 170px;
    height: 120px;
    display: block;
  }
</style>
