import request from '@/utils/request'

export function getPhotoList(data) {
  return request({
    url: '/blog/photo/list',
    method: 'post',
    data: data
  })
}

export function updatePhoto(data) {
  return request({
    url: '/blog/photo/update',
    method: 'post',
    data: data
  })
}

export function createPhoto(data) {
  return request({
    url: '/blog/photo/save',
    method: 'post',
    data: data
  })
}

export function deletePhoto(id) {
  return request({
    url: '/blog/photo/delete/' + id,
    method: 'get'
  })
}
