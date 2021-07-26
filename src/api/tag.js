import request from '@/utils/request'

export function getTagList(data) {
  return request({
    url: '/blog/tag/list',
    method: 'post',
    data: data
  })
}

export function updateTag(data) {
  return request({
    url: '/blog/tag/update',
    method: 'post',
    data: data
  })
}

export function createTag(data) {
  return request({
    url: '/blog/tag/save',
    method: 'post',
    data: data
  })
}

export function deleteTag(id) {
  return request({
    url: '/blog/tag/delete/' + id,
    method: 'get'
  })
}
