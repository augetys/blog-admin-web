import request from '@/utils/request'

export function getCategoryList(data) {
  return request({
    url: '/blog/category/list',
    method: 'post',
    data: data
  })
}

export function updateCategory(data) {
  return request({
    url: '/blog/category/update',
    method: 'post',
    data: data
  })
}

export function createCategory(data) {
  return request({
    url: '/blog/category/save',
    method: 'post',
    data: data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/blog/category/delete/' + id,
    method: 'get'
  })
}
