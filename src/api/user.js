import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/sys/user/updateStatus',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: data
  })
}

export function create(data) {
  return request({
    url: '/sys/user/create',
    method: 'post',
    data: data
  })
}

export function getRoleByUser(userId) {
  return request({
    url: '/sys/user/role/' + userId,
    method: 'get'
  })
}

export function updateRoleByUser(data) {
  return request({
    url: '/sys/user/role/update',
    method: 'post',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/sys/user/delete/' + id,
    method: 'get'
  })
}
