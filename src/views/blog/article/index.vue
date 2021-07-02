<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="博客标题">
          <el-input v-model="listQuery.name" placeholder="博客标题" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-select
            v-model="listQuery.categoryKeyword"
            style="width: 140px"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入分类名"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称">
          <el-select
            v-model="listQuery.tagKeyword"
            style="width: 140px"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入分类名"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否原创">
          <el-select v-model="listQuery.status" placeholder="是否原创">
            <el-option label="转载" value="0" />
            <el-option label="原创" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-select v-model="listQuery.status" placeholder="是否发布">
            <el-option label="下架" value="0" />
            <el-option label="发布" value="1" />
          </el-select>
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
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="author" label="作者" align="center" />
        <el-table-column prop="isOriginal" label="是否原创" align="center" />
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
  </div>
</template>
<script>
import { getArticleList, getCategoryList, getTagList } from '@/api/article'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  tagKeyword: '',
  categoryKeyword: '',
  publishKeyword: '',
  originalKeyword: ''
}
const defaultBlog = {
  id: null,
  title: null,
  summary: null,
  content: null,
  isPublish: null,
  tagId: null,
  cover: null,
  clickCount: null,
  isOriginal: null,
  author: null,
  articlesPart: null,
  articleCategoryId: null,
  sort: null,
  openComment: null
}
export default {
  name: 'Index',
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      blog: Object.assign({}, defaultBlog),
      isEdit: false,
      dialogVisible: false,
      categoryOptions: [],
      tagOptions: []
    }
  },
  created() {
    this.categoryRemoteMethod()
    this.tagRemoteMethod()
    this.getList()
  },
  methods: {
    onSubmit() {
      getArticleList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    handleAdd() {

    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, listQuery)
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
    categoryRemoteMethod() {
      const params = {}
      getCategoryList(params).then(response => {
        this.categoryOptions = response.data
      })
    },
    getList() {
      this.listLoading = true
      getArticleList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = response.data.list
        this.total = response.data.total
      })
    },
    tagRemoteMethod() {
      const params = {}
      getTagList(params).then(response => {
        this.tagOptions = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
