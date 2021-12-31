import request from '@/utils/request'

export function getSoulList(data) {
  return request({
    url: '/blog/soul/list',
    method: 'post',
    data: data
  })
}

export function updateSoul(data) {
  return request({
    url: '/blog/soul/update',
    method: 'post',
    data: data
  })
}

export function createSoul(data) {
  return request({
    url: '/blog/soul/save',
    method: 'post',
    data: data
  })
}

export function deleteSoul(id) {
  return request({
    url: '/blog/soul/delete/' + id,
    method: 'get'
  })
}
