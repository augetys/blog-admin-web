const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  addRouters: state => state.menus.addRouters,
  routers: state => state.menus.routers,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  baseApi: state => state.api.baseApi,
  fileUploadApi: state => state.api.fileUploadApi,
  filesUploadApi: state => state.api.filesUploadApi,
  filesUploadToQiniuApi: state => state.api.filesUploadToQiniuApi,
  fileUploadToQiniuApi: state => state.api.fileUploadToQiniuApi
}
export default getters
