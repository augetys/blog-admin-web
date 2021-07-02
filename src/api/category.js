import request from '@/utils/request'

export function getCategoryList(data) {
  return request({
    url: '/blog/blogCategory/list',
    method: 'post',
    data: data
  })
}

export function updateCategory(data) {
  return request({
    url: '/blog/blogCategory/update',
    method: 'post',
    data: data
  })
}

export function createCategory(data) {
  return request({
    url: '/blog/blogCategory/save',
    method: 'post',
    data: data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/blog/blogCategory/delete/' + id,
    method: 'get'
  })
}
