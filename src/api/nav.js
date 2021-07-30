import request from '@/utils/request'

export function getNavList(data) {
  return request({
    url: '/blog/nav/list',
    method: 'post',
    data: data
  })
}

export function updateNav(data) {
  return request({
    url: '/blog/nav/update',
    method: 'post',
    data: data
  })
}

export function createNav(data) {
  return request({
    url: '/blog/nav/save',
    method: 'post',
    data: data
  })
}

export function deleteNav(id) {
  return request({
    url: '/blog/nav/delete/' + id,
    method: 'get'
  })
}
