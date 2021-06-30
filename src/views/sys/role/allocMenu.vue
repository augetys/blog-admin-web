<template>
  <div>
    <el-card class="form-container" shadow="never">
      <el-tree
        ref="tree"
        :data="menuTreeList"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :props="defaultProps"
      />
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="handleClear()">清空</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>

import { getMenuTree } from '@/api/menu'
import { allocMenu, getAllMenuByRoleId } from '@/api/role'

export default {
  name: 'AllocMenu',
  data() {
    return {
      menuTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleId: null,
      isCheck: false
    }
  },
  created() {
    this.getAllMenuList()
    this.roleId = this.$route.query.roleId
    this.getMenusByRole(this.roleId)
  },
  methods: {
    getAllMenuList() {
      getMenuTree().then(response => {
        this.menuTreeList = response.data
      })
    },
    getMenusByRole(roleId) {
      getAllMenuByRoleId(roleId).then(response => {
        const menuList = response.data
        // 进入的时候会显示全没打勾，接口响应数据完之后，就打勾了
        const that = this
        // 回显问题，子菜单未全部选中，父级菜单id存在则会全选
        setTimeout(function() {
          menuList.forEach(value => {
            that.$refs.tree.setChecked(value, true, false)
          })
        }, 100)
      })
    },
    handleSave() {
      // 获取全选和半选
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedNodes = checkedKeys.concat(halfKeys)
      const checkedMenuIds = new Set()
      if (checkedNodes != null && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          const checkedNode = checkedNodes[i]
          checkedMenuIds.add(checkedNode)
        }
      }
      this.$confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        allocMenu({
          roleId: this.roleId,
          menuIds: Array.from(checkedMenuIds)
        }).then(response => {
          this.$message({
            message: response.message,
            type: 'success',
            duration: 1000
          })
          location.reload()
          this.$route.go(-1)
        })
      })
    },
    handleClear() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style scoped>

</style>
