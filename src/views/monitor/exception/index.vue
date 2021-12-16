<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="listQuery.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="操作内容">
          <el-input v-model="listQuery.operation" placeholder="操作内容" />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="listQuery.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
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
        <el-table-column prop="userName" label="操作人" align="center" />
        <el-table-column prop="url" label="请求接口" align="center" />
        <el-table-column prop="operation" label="操作名称" align="center" />
        <el-table-column prop="ip" label="IP" align="center" />
        <el-table-column prop="ipAddress" label="IP来源" align="center" />
        <el-table-column label="异常详情" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="handleDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
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
      :title="'异常详情'"
      :visible.sync="dialogVisible"
      width="85%"
    >
      <pre v-highlightjs="exceptionLogDetail"><code class="java" /></pre>
    </el-dialog>
  </div>
</template>

<script>

import { getExceptionLogList } from '@/api/log'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  userName: null,
  operation: null,
  createTime: null
}
export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      userId: null,
      dialogVisible: false,
      exceptionLogDetail: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      getExceptionLogList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    getList() {
      this.listLoading = true
      getExceptionLogList(this.listQuery).then(response => {
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
    handleDetail(row) {
      this.dialogVisible = true
      this.exceptionLogDetail = row.exceptionJson
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
