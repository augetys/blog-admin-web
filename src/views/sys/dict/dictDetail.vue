<template>
  <div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="tableList"
        border
        style="width: 100%"
      >
        <el-table-column prop="label" label="字典标签" align="center" />
        <el-table-column prop="value" label="字典值" align="center" />
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('dictDetailForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDetailById } from '@/api/dict'

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
      dictId: null
    }
  },
  created() {
    this.dictId = this.$route.query.dictId
    this.getDetailById(this.dictId)
  },
  methods: {
    handleStatusChange() {

    },
    getDetailById(id) {
      getDetailById(id).then(response => {
        this.listLoading = false
        this.tableList = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
