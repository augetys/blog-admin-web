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

export function getDetailById(data) {
  return request({
    url: '/sys/dict/getDetailById',
    method: 'post',
    data: data
  })
}

export function updateDictDetail(data) {
  return request({
    url: '/sys/dictDetail/update',
    method: 'post',
    data: data
  })
}

export function createDictDetail(data) {
  return request({
    url: '/sys/dictDetail/save',
    method: 'post',
    data: data
  })
}

export function deleteDictDetail(id) {
  return request({
    url: '/sys/dictDetail/delete/' + id,
    method: 'get'
  })
}

export function updateStatus(data) {
  return request({
    url: '/sys/dict/updateStatus',
    method: 'post',
    data: data
  })
}
