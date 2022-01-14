x<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model.trim="listQuery.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="listQuery.nickName" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="listQuery.status" placeholder="账号状态">
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd()">添加</el-button>
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
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="icon" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" style="width: 50px;height: 50px" alt="头像">
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" align="center" />
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
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button type="success" size="small" @click="handleSelectRole(scope.row)">分配角色</el-button>
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
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="adminForm"
        :model="admin"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="admin.username" style="width: 250px" />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input v-model="admin.nickName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="admin.email" style="width: 250px" />
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input
            v-model="admin.note"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('adminForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allocDialogVisible"
      width="45%"
    >
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="allocDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAllocDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, update, updateStatus, create, getRoleByUser, updateRoleByUser, deleteUser } from '@/api/user'
import { roleList } from '@/api/role'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  username: null,
  nickName: null,
  status: null
}
const defaultAdmin = {
  id: null,
  username: null,
  nickName: null,
  email: null,
  note: null,
  status: 1
}
export default {
  name: 'Index',
  data() {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      dialogVisible: false,
      isEdit: false,
      admin: Object.assign({}, defaultAdmin),
      total: null,
      listLoading: false,
      allRoleList: [],
      allocRoleIds: [],
      allocDialogVisible: false,
      userId: null,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getAllRoleList()
  },
  methods: {
    onSubmit() {
      // 重置分页参数
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      list(this.listQuery).then(response => {
        this.tableList = response.data.list
        this.total = response.data.total
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
        }).catch(res => {
          // fix el-switch 点击始终会改变状态
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
        this.getList()
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['adminForm'].clearValidate()
      })
      this.isEdit = true
      this.admin = Object.assign({}, row)
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
        this.$refs['adminForm'].clearValidate()
      })
      this.isEdit = false
      this.admin = Object.assign({}, defaultAdmin)
    },
    handleDialogConfirm(adminForm) {
      this.$refs[adminForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              update(this.admin).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              create(this.admin).then(response => {

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
    handleSelectRole(row) {
      this.allocDialogVisible = true
      this.userId = row.id
      this.getRoleListByUser(row.id)
    },
    getAllRoleList() {
      roleList(this.listQuery).then(response => {
        this.allRoleList = response.data.list
      })
    },
    getRoleListByUser(userId) {
      getRoleByUser(userId).then(response => {
        const allocRoleList = response.data
        this.allocRoleIds = []
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id)
          }
        }
      })
    },
    handleAllocDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('userId', this.userId)
        params.append('roleIds', this.allocRoleIds)
        updateRoleByUser(params).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.allocDialogVisible = false
        })
      })
    },
    handleDelete(row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
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

<style lang="scss" scoped>

</style>
