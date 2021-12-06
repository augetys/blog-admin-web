<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="邮箱配置">
        <span slot="label"><i class="el-icon-edit" /> 邮箱配置</span>
        <el-form ref="mailForm" style="margin-left: 20px;" label-position="left" label-width="80px">

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

      <el-tab-pane label="发送邮件">
        <span slot="label"><i class="el-icon-edit" /> 发送邮件</span>
        <el-form ref="sendMail" style="margin-left: 20px;" label-position="left" label-width="80px">

          <el-form-item label="主题" prop="subject">
            <el-input v-model="send.subject" style="width: 646px" />
          </el-form-item>

          <el-form-item label="收件人" prop="tos">
            <el-input v-model="sends" style="width: 646px" />
          </el-form-item>

          <el-form-item label="邮件内容" prop="content">
            <WangEditor ref="editor" style="width: 646px" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="sendMail('sendMail')">发送邮件
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="配置说明">
        <pre class="my-code">
        # 邮件服务器的SMTP地址，可选，默认为smtp
        # 邮件服务器的SMTP端口，可选，默认465或者25
        # 发件人（必须正确，否则发送失败）
        # 用户名，默认为发件人邮箱前缀
        # 密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等）
        # 如果使用jdk8,ssl,可能出现发送失败，https://blog.csdn.net/fujunsfzh/article/details/118418313
        </pre>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getMailConfig, sendMailContent, updateMail } from '@/api/config'
import WangEditor from '@/components/WangEditor'

export default {
  name: 'Index',
  components: {
    WangEditor
  },
  data() {
    return {
      sends:'',
      mail: {
        fromUser: '',
        host: '',
        id: '',
        pass: '',
        user: '',
        port: ''
      },
      send: {
        tos: [],
        subject: '',
        content: ''
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
    },
    sendMail() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.send.tos = this.sends.split(',')
        sendMailContent(this.send).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
  .my-code {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    line-height: 40px;
  }
</style>
