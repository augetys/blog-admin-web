<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="任务名称">
          <el-input v-model.trim="listQuery.jobName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="listQuery.isPause" placeholder="任务状态">
            <el-option label="暂停" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd()">添加</el-button>
          <el-button type="primary" icon="el-icon-tickets" @click="checkLog()">查看任务日志</el-button>
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
        <el-table-column prop="id" label="任务ID" align="center" />
        <el-table-column prop="jobName" label="任务名称" align="center" show-overflow-tooltip />
        <el-table-column prop="beanName" label="Bean名称" align="center" />
        <el-table-column prop="methodName" label="执行方法" align="center" />
        <el-table-column prop="subTask" label="子任务ID" align="center" />
        <el-table-column prop="params" label="参数" align="center" />
        <el-table-column prop="cronExpression" label="cron表达式" align="center" />
        <el-table-column prop="isPause" label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isPause"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建日期" align="center" />
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="exec(scope.row)">执行一次</el-button>
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
      :title="isEdit?'编辑任务':'添加任务'"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form
        ref="taskForm"
        :model="task"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="task.jobName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="task.description" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="task.beanName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="task.methodName" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="task.cronExpression" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="子任务ID">
          <el-input v-model="task.subTask" placeholder="多个用逗号隔开，按顺序执行" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="任务负责人" prop="personInCharge">
          <el-input v-model="task.personInCharge" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="告警邮箱" prop="email">
          <el-input v-model="task.email" placeholder="多个邮箱用逗号隔开" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="失败后暂停">
          <el-radio-group v-model="task.pauseAfterFailure" style="width: 220px">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="task.isPause" style="width: 220px">
            <el-radio :label="0" :disabled="isEdit">启用</el-radio>
            <el-radio :label="1" :disabled="isEdit">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input v-model="task.params" style="width: 556px;" rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('taskForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--日志-->
    <el-dialog
      title="调度日志"
      :visible.sync="dialogVisibleLog"
      width="60%"
    >
      <!--工具栏-->
      <div class="search">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="任务名称">
            <el-input v-model="listQueryLog.jobName" placeholder="任务名称" />
          </el-form-item>
          <el-form-item label="是否成功">
            <el-select v-model="listQueryLog.isSuccess" placeholder="是否成功">
              <el-option label="失败" value="0" />
              <el-option label="成功" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmitLog()">搜索</el-button>
            <el-button type="primary" plain @click="handleResetSearchLog()">重置</el-button>
            <el-button type="primary" icon="el-icon-refresh" plain @click="refreshLog()">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="tableListLog"
          border
          style="width: 100%"
        >
          <el-table-column prop="jobName" label="任务名称" align="center" show-overflow-tooltip />
          <el-table-column prop="beanName" label="Bean名称" align="center" />
          <el-table-column prop="methodName" label="执行方法" align="center" />
          <el-table-column prop="params" label="参数" align="center" />
          <el-table-column prop="cronExpression" width="100px" label="cron表达式" align="center" />
          <el-table-column prop="exceptionDetail" label="异常详情" align="center">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.exceptionDetail"
                size="mini"
                type="text"
                @click="info(scope.row.exceptionDetail)"
              >查看详情
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isSuccess" width="80px" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">{{ scope.row.isSuccess ? '成功' : '失败' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="time" label="耗时(毫秒)" />
          <el-table-column prop="createTime" label="执行日期" width="160px" align="center" />
        </el-table>
        <el-pagination
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQueryLog.pageNum"
          :page-size="listQueryLog.pageSize"
          :page-sizes="[10,50,100]"
          :total="totalLog"
          style="padding-top:10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog :visible.sync="errorDialog" append-to-body title="异常详情" width="85%">
        <pre v-highlightjs="errorInfo"><code class="java" /></pre>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { execTask, createTask, deleteTask, getTaskList, getTaskLogList, updateStatus, updateTask } from '@/api/task'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  jobName: null,
  isSuccess: null,
  createTime: []
}
const listQueryLog = {
  pageNum: 1,
  pageSize: 10,
  jobName: null,
  isPause: null,
  createTime: []
}
const defaultTask = {
  id: null,
  jobName: null,
  subTask: null,
  beanName: null,
  methodName: null,
  params: null,
  cronExpression: null,
  pauseAfterFailure: true,
  isPause: false,
  personInCharge: null,
  email: null,
  description: null
}
export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      listQueryLog: Object.assign({}, listQueryLog),
      listLoading: false,
      tableList: [],
      tableListLog: [],
      task: Object.assign({}, defaultTask),
      isEdit: false,
      dialogVisible: false,
      dialogVisibleLog: false,
      errorDialog: false,
      total: null,
      totalLog: null,
      errorInfo: null,
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: '请输入Bean名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请输入Cron表达式', trigger: 'blur' }
        ],
        personInCharge: [
          { required: true, message: '请输入负责人名称', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入报警邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmitLog() {
      getTaskLogList(this.listQueryLog).then(response => {
        this.tableListLog = response.data.list
      })
    },
    handleResetSearchLog() {
      this.listQueryLog = Object.assign({}, listQueryLog)
    },
    onSubmit() {
      getTaskList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getTaskList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    refreshLog() {
      this.getListLog()
    },
    getListLog() {
      this.listLoading = true
      getTaskLogList(this.listQueryLog).then(response => {
        this.listLoading = false
        this.tableListLog = response.data.list
        this.totalLog = response.data.total
      })
    },
    exec(row) {
      execTask(row.id).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },
    handleStatusChange(row) {
      this.$confirm('是否要修改启用状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus({ id: row.id, isPause: row.isPause }).then(response => {
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
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
      this.task = Object.assign({}, row)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
      this.task = Object.assign({}, defaultTask)
    },
    handleDialogConfirm(taskForm) {
      this.$refs[taskForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateTask(this.task).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createTask(this.task).then(response => {
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
      this.$confirm('是否要删除该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    checkLog() {
      this.dialogVisibleLog = true
      this.getListLog()
    },
    // 异常详情
    info(errorInfo) {
      this.errorInfo = errorInfo
      this.errorDialog = true
    }
  }
}
</script>

<style scoped>

</style>
