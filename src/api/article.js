import request from '@/utils/request'

export function getArticleList(data) {
  return request({
    url: '/blog/article/list',
    method: 'post',
    data: data
  })
}

export function getCategoryList(data) {
  return request({
    url: '/blog/category/findAll',
    method: 'post',
    data: data
  })
}

export function getTagList(data) {
  return request({
    url: '/blog/tag/findAll',
    method: 'post',
    data: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/blog/article/update',
    method: 'post',
    data: data
  })
}

export function createArticle(data) {
  return request({
    url: '/blog/article/save',
    method: 'post',
    data: data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/blog/article/delete/' + id,
    method: 'get'
  })
}
