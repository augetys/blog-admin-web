<template>
  <div>
    <el-tabs type="border-card">

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
        </pre>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { sendMailContent } from '@/api/mail'
import WangEditor from '@/components/WangEditor'

export default {
  name: 'Index',
  components: {
    WangEditor
  },
  data() {
    return {
      sends: '',
      send: {
        tos: [],
        subject: '',
        content: ''
      }
    }
  },
  created() {

  },
  methods: {
    sendMail() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.send.tos = this.sends.split(',')
        this.send.content = this.$refs.editor.getHtml()
        sendMailContent(this.send).then(response => {
          Object.assign({}, this.send)
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
