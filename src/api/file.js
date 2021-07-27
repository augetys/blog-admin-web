import request from '@/utils/request'

export function uploadPhoto(data) {
  return request({
    url: '/resource/local/file',
    method: 'post',
    data: data
  })
}

export function uploadPhotos(data) {
  return request({
    url: '/resource/local/files',
    method: 'post',
    data: data
  })
}

export function uploadPhotosToQiniu(data) {
  return request({
    url: '/resource/qiniu/file',
    method: 'post',
    data: data
  })
}

export function uploadPhotoToQiniu(data) {
  return request({
    url: '/resource/qiniu/files',
    method: 'post',
    data: data
  })
}
