import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/sys/menus/treeList',
    method: 'get'
  })
}

export function getMenuList(data) {
  return request({
    url: '/sys/menus/list',
    method: 'post',
    data: data
  })
}

export function updateMenu(data) {
  return request({
    url: '/sys/menus/update',
    method: 'post',
    data: data
  })
}
export function createMenu(data) {
  return request({
    url: '/sys/menus/save',
    method: 'post',
    data: data
  })
}
export function deleteMenu(id) {
  return request({
    url: '/sys/menus/delete/' + id,
    method: 'get'
  })
}
export function updateStatus(data) {
  return request({
    url: '/sys/menus/updateStatus',
    method: 'post',
    data: data
  })
}
