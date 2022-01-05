<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="菜单名称">
          <el-input v-model.trim="listQuery.name" placeholder="菜单名称" />
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
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="菜单名称" align="center" />
        <el-table-column prop="path" label="路径" align="center" />
        <el-table-column prop="icon" label="图标" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.id === '1'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
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
      :title="isEdit?'编辑菜单':'添加菜单'"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="menuForm"
        :model="menu"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="menu.name" style="width: 250px" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="上级菜单：" prop="parentId">
          <el-select
            v-model="treeDataValue"
            placeholder="请选择菜单"
            style="width: 250px"
          >
            <el-option
              value=""
              style="height: auto"
            >
              <el-tree
                ref="tree"
                :data="selectMenuList"
                node-key="id"
                :props="defaultProps"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径：" prop="path">
          <el-input v-model="menu.path" style="width: 250px" />
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <el-input v-model="menu.icon" style="width: 250px" />
          <svg-icon style="margin-left: 8px" :icon-class="menu.icon===null?'':menu.icon" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model.number="menu.sort" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('menuForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createMenu, updateMenu, deleteMenu, getMenuTree, updateStatus } from '@/api/menu'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultMenu = {
  id: null,
  parentId: null,
  name: null,
  description: null,
  path: null,
  icon: null,
  level: null,
  sort: null,
  isShow: null
}

export default {
  name: 'Index',
  data() {
    return {
      treeDataValue: null,
      listQuery: Object.assign({}, listQuery),
      listLoading: false,
      tableList: [],
      menu: Object.assign({}, defaultMenu),
      isEdit: false,
      dialogVisible: false,
      total: null,
      selectMenuList: [],
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        path: { required: true, message: '请输入菜单路径', trigger: 'blur' },
        icon: { required: true, message: '请输入菜单图标', trigger: 'blur' },
        sort: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' },
          { type: 'number', required: true, message: '排序必须为数字', trigger: 'blur' },
          { pattern: /^(?:[1-9]\d{0,3}|0)$/, message: '范围在0-9999', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      getMenuTree(this.listQuery).then(response => {
        this.getList()
      })
    },
    handleUpdate(row) {
      this.menu = Object.assign({}, row)
      this.isEdit = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('是否要删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
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
        updateStatus({ id: row.id, isShow: row.isShow }).then(response => {
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
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
    },
    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
      })
      this.menu = Object.assign({}, defaultMenu)
    },
    handleDialogConfirm(menuForm) {
      this.$refs[menuForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateMenu(this.menu).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogVisible = false
                this.getList()
              })
            } else {
              createMenu(this.menu).then(response => {
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
    getList() {
      this.listLoading = true
      getMenuTree(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data
        this.selectMenuList = response.data
      })
    },
    handleNodeClick(data) {
      this.treeDataValue = data.name
      this.menu.parentId = data.id
    }
  }
}
</script>

<style scoped>
  .el-select-dropdown__item{
    padding: 0;
  }
</style>
