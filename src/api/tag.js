import request from '@/utils/request'

export function getTagList(data) {
  return request({
    url: '/blog/blogTag/list',
    method: 'post',
    data: data
  })
}

export function updateTag(data) {
  return request({
    url: '/blog/blogTag/update',
    method: 'post',
    data: data
  })
}

export function createTag(data) {
  return request({
    url: '/blog/blogTag/save',
    method: 'post',
    data: data
  })
}

export function deleteTag(id) {
  return request({
    url: '/blog/blogTag/delete/' + id,
    method: 'get'
  })
}
