<template>
  <div>
    <div class="search">

      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入字典名称"
      />

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd()">添加</el-button>
        <el-button type="primary" plain @click="handleResetSearch()">重置</el-button>
      </el-form-item>
    </div>

    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="tableList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="name" label="字典名称" align="center" />
        <el-table-column prop="description" label="描述" align="center" />
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
        :model="dict"
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
const listQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const defaultDict = {
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
      dict: Object.assign({}, defaultDict),
      tableList: [],
    }
  }
}
</script>

<style scoped>

</style>
