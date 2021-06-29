import request from '@/utils/request'

export function roleList(data) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data: data
  })
}

export function createRole(data) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data: data
  })
}

export function deleteRole(id) {
  return request({
    url: '/sys/role/delete/' + id,
    method: 'get'
  })
}

export function allocMenu(data) {
  return request({
    url: '/sys/role/allocMenu',
    method: 'post',
    data: data
  })
}

export function getAllMenuByRoleId(roleId) {
  return request({
    url: '/sys/role/listMenu/' + roleId,
    method: 'get'
  })
}

