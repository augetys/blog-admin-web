<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="listQuery.name" placeholder="角色名称" />
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
        <el-table-column prop="name" label="角色名称" align="center" />
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button type="success" size="small" @click="handleSelectRole(scope.row)">分配菜单</el-button>
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
      :title="isEdit?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="roleForm"
        :model="role"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="role.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="role.description" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createRole, deleteRole, roleList, updateRole } from '@/api/role'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultRole = {
  id: null,
  name: null,
  description: null
}
export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      listLoading: false,
      tableList: null,
      role: Object.assign({}, defaultRole),
      isEdit: false,
      dialogVisible: false,
      total: null,
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      roleList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      roleList(this.listQuery).then(response => {
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
    handleUpdate(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.role = Object.assign({}, row)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.role = Object.assign({}, defaultRole)
    },
    handleDialogConfirm(roleForm) {
      this.$refs[roleForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateRole(this.role).then(response => {
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
              createRole(this.role).then(response => {
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
    handleDelete(row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(response => {
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
    },
    handleSelectRole(row) {
      this.$router.push({ path: '/sys/allocMenu', query: { roleId: row.id }})
    }
  }
}
</script>

<style scoped>

</style>
