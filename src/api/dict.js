import request from '@/utils/request'

export function getDictList(data) {
  return request({
    url: '/sys/dict/list',
    method: 'post',
    data: data
  })
}

export function updateDict(data) {
  return request({
    url: '/sys/dict/update',
    method: 'post',
    data: data
  })
}

export function createDict(data) {
  return request({
    url: '/sys/dict/save',
    method: 'post',
    data: data
  })
}

export function deleteDict(id) {
  return request({
    url: '/sys/dict/delete/' + id,
    method: 'get'
  })
}

export function getDetailById(id) {
  return request({
    url: '/sys/dict/getDetailById/' + id,
    method: 'get'
  })
}

