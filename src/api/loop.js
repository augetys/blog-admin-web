import request from '@/utils/request'

export function getLoopList(data) {
  return request({
    url: '/blog/loop/list',
    method: 'post',
    data: data
  })
}

export function updateLoop(data) {
  return request({
    url: '/blog/loop/update',
    method: 'post',
    data: data
  })
}

export function createLoop(data) {
  return request({
    url: '/blog/loop/save',
    method: 'post',
    data: data
  })
}

export function deleteLoop(id) {
  return request({
    url: '/blog/loop/delete/' + id,
    method: 'get'
  })
}
