<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="邮箱配置">
        <span slot="label"><i class="el-icon-edit" /> 邮箱配置</span>
        <el-form ref="mailForm" style="margin-left: 20px;" label-position="left" label-width="80px">

          <aside>
            邮箱配置主要用于配置网站消息的接收<br>
          </aside>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="mail.fromUser" style="width: 400px" />
          </el-form-item>

          <el-form-item label="密码" prop="newPwd1">
            <el-input v-model="mail.pass" type="password" style="width: 400px" />
          </el-form-item>

          <el-form-item label="用户名" prop="newPwd2">
            <el-input v-model="mail.user" style="width: 400px" />
          </el-form-item>

          <el-form-item label="SMTP地址" prop="newPwd2">
            <el-input v-model="mail.host" style="width: 400px" />
          </el-form-item>

          <el-form-item label="SMTP端口" prop="newPwd2">
            <el-input v-model="mail.port" style="width: 400px" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('mailForm')">保 存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getMailConfig, updateMail } from '@/api/config'

export default {
  name: 'Index',
  data() {
    return {
      mail: {
        fromUser: '',
        host: '',
        id: '',
        pass: '',
        user: '',
        port: ''
      }
    }
  },
  created() {
    this.getMail()
  },
  methods: {
    getMail() {
      getMailConfig().then(response => {
        this.mail = response.data
      })
    },
    submitForm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateMail(this.mail).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.getMail()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
