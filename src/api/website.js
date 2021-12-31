import request from '@/utils/request'

export function getWebsiteList(data) {
  return request({
    url: '/blog/website/list',
    method: 'post',
    data: data
  })
}

export function updateWebsite(data) {
  return request({
    url: '/blog/website/update',
    method: 'post',
    data: data
  })
}

export function createWebsite(data) {
  return request({
    url: '/blog/website/save',
    method: 'post',
    data: data
  })
}

export function deleteWebsite(id) {
  return request({
    url: '/blog/website/delete/' + id,
    method: 'get'
  })
}
