import request from '@/utils/request'

export function getFileList(data) {
  return request({
    url: '/resource/local/list',
    method: 'post',
    data: data
  })
}

export function deleteFile(id) {
  return request({
    url: '/resource/local/delete/' + id,
    method: 'get'
  })
}

export function updateFile(data) {
  return request({
    url: '/resource/local/update',
    method: 'post',
    data: data
  })
}

export function getQiniuFileList(data) {
  return request({
    url: '/resource/qiniu/list',
    method: 'post',
    data: data
  })
}

export function uploadFileToQiniu(data) {
  return request({
    url: '/resource/qiniu/file',
    method: 'post',
    data: data
  })
}

export function uploadFilesToQiniu(data) {
  return request({
    url: '/resource/qiniu/files',
    method: 'post',
    data: data
  })
}


export function deleteQiniuFile(id) {
  return request({
    url: '/resource/qiniu/delete/' + id,
    method: 'get'
  })
}

export function getQiniuConfig() {
  return request({
    url: '/resource/qiniu/findConfig',
    method: 'post'
  })
}
