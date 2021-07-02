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
