<template>
  <div>
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="博客标题">
          <el-input v-model="listQuery.title" placeholder="博客标题" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-select
            v-model="listQuery.categoryId"
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
            v-model="listQuery.tagId"
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
          <el-select v-model="listQuery.isOriginal" clearable placeholder="是否原创">
            <el-option label="转载" value="0" />
            <el-option label="原创" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-select v-model="listQuery.isPublish" clearable placeholder="是否发布">
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
        <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" align="center" />
        <el-table-column prop="isOriginal" label="是否原创" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOriginal===1" type="success">原创</el-tag>
            <el-tag v-if="scope.row.isOriginal===0" type="info">转载</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
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
    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="isEdit?'编辑文章':'添加文章'"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form ref="form" :model="blog" :rules="rules">

        <el-row>
          <el-col :span="16">
            <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
              <el-input v-model="blog.title" auto-complete="off" />
            </el-form-item>

            <el-form-item label="简介" :label-width="formLabelWidth">
              <el-input v-model="blog.summary" type="textarea" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="封面" prop="cover" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleCrop"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="blog.cover" :src="blog.cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <!-- 剪裁组件弹窗 -->
              <cropperImage
                :dialog-visible="showCropper"
                :cropper-option="cropperOption"
                :file-size="fileSize"
                :cropper-style="cropperStyle"
                @close="showCropper=false"
                @uploadCropper="uploadImg"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6.5">
            <el-form-item label="分类" :label-width="formLabelWidth" prop="categoryId">
              <el-select
                v-model="blog.categoryId"
                size="small"
                placeholder="请选择"
                style="width:150px"
                filterable
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="标签" label-width="80px" prop="tagId">
              <el-select
                v-model="blog.tagId"
                multiple
                size="small"
                placeholder="请选择"
                style="width:210px"
                filterable
                :multiple-limit="limit"
              >
                <el-option
                  v-for="item in tagOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- https://blog.csdn.net/Superman_peng/article/details/109163942-->
        <el-row>
          <el-col :span="6.5">
            <el-form-item label="是否原创" :label-width="formLabelWidth" prop="isOriginal">
              <el-radio-group v-model="blog.isOriginal" size="small">
                <el-radio
                  v-for="item in blogOriginalDictList"
                  :key="item.id"
                  :label="parseInt(item.value)"
                  border
                  size="small"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="6.5">
            <el-form-item label="文章评论" :label-width="formLabelWidth" prop="openComment">
              <el-radio-group v-model="blog.openComment" size="small">
                <el-radio
                  v-for="item in blogCommentDisable"
                  :key="item.id"
                  :label="parseInt(item.value)"
                  border
                  size="small"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="4.5">
            <el-form-item label="是否发布" :label-width="lineLabelWidth" prop="isPublish">
              <el-radio-group v-model="blog.isPublish" size="small">
                <el-radio v-for="item in blogPublishDictList" :key="item.id" :label="parseInt(item.value)" border>{{
                  item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="blog.isOriginal===0" label="作者" :label-width="formLabelWidth" prop="articleAuthor">
          <el-input v-model="blog.articleAuthor" auto-complete="off" />
        </el-form-item>

        <el-form-item v-if="blog.isOriginal===0" label="文章出处" :label-width="formLabelWidth">
          <el-input v-model="blog.articlePart" auto-complete="off" />
        </el-form-item>

        <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
          <MarkDown ref="editor" :content="blog.content" :height="465" />
        </el-form-item>

        <el-form-item style="float: right; margin-right: 20px;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  createArticle,
  deleteArticle,
  getArticleList,
  getCategoryList,
  getTagList,
  updateArticle
} from '@/api/article'
import MarkDown from '@/components/Markdown'
import CropperImage from '@/components/Upload/CropperImage'
import { uploadFileToQiniu } from '@/api/file'
import { getDetailByNames } from '@/api/dict'

const listQuery = {
  pageNum: 1,
  pageSize: 10,
  tagId: '',
  categoryId: '',
  isPublish: '',
  isOriginal: '',
  title: ''
}
const defaultBlog = {
  id: null,
  title: null,
  summary: null,
  content: null,
  isPublish: null,
  tagId: '',
  cover: null,
  clickCount: null,
  isOriginal: null,
  author: null,
  articlePart: null,
  articleAuthor: null,
  categoryId: null,
  categoryName: null,
  sort: null,
  openComment: null
}
export default {
  name: 'Index',
  components: {
    MarkDown,
    CropperImage
  },
  data() {
    return {
      listQuery: Object.assign({}, listQuery),
      tableList: null,
      total: null,
      listLoading: false,
      blog: Object.assign({}, defaultBlog),
      isEdit: false,
      categoryOptions: [],
      tagOptions: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      lineLabelWidth: '120px',
      blogOriginalDictList: [],
      blogPublishDictList: [],
      blogCommentDisable: [],
      showCropper: false, // 显示裁剪弹窗
      canCropper: false,
      fileSize: 2, // 限制文件上传大小
      cropperOption: {
        img: '',
        autoCropWidth: 170,
        autoCropHeight: 120
      },
      cropperStyle: {
        width: '390px',
        height: '290px'
      },
      limit: 5,
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        tagId: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
        isPublish: [
          { required: true, message: '发布字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '发布字段只能为数字' }
        ],
        isOriginal: [
          { required: true, message: '原创字段不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '原创字段只能为数字' }
        ],
        openComment: [
          { required: true, message: '网站评论不能为空', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '网站评论只能为数字' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请上传封面', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.categoryRemoteMethod()
    this.tagRemoteMethod()
    this.getList()
    this.getDictList()
  },
  methods: {
    onSubmit() {
      getArticleList(this.listQuery).then(response => {
        this.tableList = response.data.list
      })
    },
    getDictList() {
      const dictTypeList = ['blog_original_status', 'blog_publish_status', 'blog_comment_disable']
      getDetailByNames(dictTypeList).then(response => {
        const dictMap = response.data
        this.blogOriginalDictList = dictMap.blog_original_status
        this.blogPublishDictList = dictMap.blog_publish_status
        this.blogCommentDisable = dictMap.blog_comment_disable
      })
    },
    handleAdd() {
      this.isEdit = false
      this.dialogFormVisible = true
      this.blog = Object.assign({}, defaultBlog)
      const that = this
      this.$nextTick(() => {
        // DOM现在更新了
        that.$refs.editor.initData()
      })
    },
    handleUpdate(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.blog = Object.assign({}, row)
      this.blog.tagId = row.tagId.split(',')
      const that = this
      this.$nextTick(() => {
        // DOM现在更新了
        that.$refs.editor.setHtml(that.blog.content) // 设置富文本内容
      })
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
    },
    submitForm() {
      this.blog.content = this.$refs.editor.getHtml()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.blog.tagId = this.blog.tagId.join(',')
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateArticle(this.blog).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogFormVisible = false
                this.getList()
              }).catch(res => {
                this.blog.tagId = this.blog.tagId.split(',')
              })
            } else {
              createArticle(this.blog).then(response => {
                this.$message({
                  type: 'success',
                  message: response.message
                })
                this.dialogFormVisible = false
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
      this.$confirm('是否要删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getList()
        })
      })
    },
    handleCrop(file) {
      // 点击弹出剪裁框
      this.$nextTick(() => {
        if (this.canCropper) {
          this.cropperOption.img = window.URL.createObjectURL(file.raw)
          this.showCropper = this.canCropper
        }
      })
    },
    beforeAvatarUpload(file) {
      // 上传前校验
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2 MB!')
      }
      // 校验通过后显示裁剪框
      this.canCropper = isJPG && isLt2M
      return false
    },
    // 自定义上传方法
    uploadImg(file, data) {
      const fileFormData = new FormData()
      fileFormData.append('file', file)
      fileFormData.append('bucket', 'hopelittle')
      fileFormData.append('name', file.name)
      uploadFileToQiniu(fileFormData, this).then(res => {
        this.blog.cover = res.data.url
        this.showCropper = false
        this.$message({
          message: res.message,
          type: 'success'
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
    width: 170px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 170px;
    height: 120px;
    display: block;
  }
</style>
