import request from '@/utils/request'

export function getArticleList(data) {
  return request({
    url: '/blog/blogArticle/list',
    method: 'post',
    data: data
  })
}
export function getCategoryList(data) {
  return request({
    url: '/blog/blogCategory/findAll',
    method: 'post',
    data: data
  })
}

export function getTagList(data) {
  return request({
    url: '/blog/blogTag/findAll',
    method: 'post',
    data: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/blog/blogArticle/update',
    method: 'post',
    data: data
  })
}

export function createArticle(data) {
  return request({
    url: '/blog/blogArticle/save',
    method: 'post',
    data: data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/blog/blogArticle/delete/' + id,
    method: 'get'
  })
}
