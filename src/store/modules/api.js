// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 本地多文件上传
    filesUploadApi: baseUrl + '/resource/local/files',
    // 本地单文件上传
    fileUploadApi: baseUrl + '/resource/local/file',
    // 七牛云多文件上传
    filesUploadToQiniuApi: baseUrl + '/resource/qiniu/files',
    // 七牛云单文件上传
    fileUploadToQiniuApi: baseUrl + '/resource/qiniu/file',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
