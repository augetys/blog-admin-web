<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标签名称">
          <el-input v-model="listQuery.label" placeholder="标签名称" />
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
        <el-table-column prop="label" label="字典名称" align="center">
          <el-tag type="danger">{{ dictName }}</el-tag>
        </el-table-column>
        <el-table-column prop="label" label="字典标签" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="字典值" align="center">
          <template slot-scope="scope">
            <el-tag type="warning">{{ scope.row.value }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column prop="status" label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isEdit?'编辑字典详情':'添加字典详情'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="dictDetailForm"
        :model="dictDetail"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="字典标签：" prop="name">
          <el-input v-model="dictDetail.label" style="width: 250px" />
        </el-form-item>
        <el-form-item label="值：" prop="description">
          <el-input v-model="dictDetail.value" style="width: 250px" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="dictDetail.sort" style="width: 250px" />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="dictDetail.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('dictDetailForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateStatus, deleteDictDetail, getDetailById, updateDictDetail, createDictDetail } from '@/api/dict'

const listQuery = {
  label: null,
  dictId: null
}
const defaultDictDetail = {
  id: null,
  dictId: null,
  label: null,
  sort: null,
  status: null
}
export default {
  name: 'DictDetail',
  data() {
    return {
      isEdit: false,
      dialogVisible: false,
      dictDetail: Object.assign({}, defaultDictDetail),
      tableList: [],
      listLoading: false,
      listQuery: Object.assign({}, listQuery),
      dictName: null,
      dictId: null,
      rules: {
        label: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', required: true, message: '排序只能为自然数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.dictId = this.$route.query.dictId
    this.dictName = this.$route.query.dictName
    this.getList()
  },
  methods: {
    onSubmit() {
      this.listQuery.dictId = this.dictId
      getDetailById(this.listQuery).then(response => {
        this.tableList = response.data
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getDetailById(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.dictDetail = Object.assign({}, defaultDictDetail)
      this.dictDetail.dictId = this.dictId
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.dictDetail = Object.assign({}, row)
      this.dictDetail.dictId = this.dictId
    },
    handleDelete(row) {
      this.$confirm('是否要删除该标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictDetail(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    handleStatusChange(row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus({ id: row.id, status: row.status }).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
        this.getList()
      })
    },
    handleDialogConfirm(dictDetailForm) {
      this.$refs[dictDetailForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateDictDetail(this.dictDetail).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createDictDetail(this.dictDetail).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
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
    }
  }
}
</script>

<style scoped>

</style>
