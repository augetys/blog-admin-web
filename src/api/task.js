import request from '@/utils/request'

export function getTaskList(data) {
  return request({
    url: '/sys/task/jobs',
    method: 'post',
    data: data
  })
}

export function getTaskLogList(data) {
  return request({
    url: '/sys/task/logs',
    method: 'post',
    data: data
  })
}

export function updateTask(data) {
  return request({
    url: '/sys/task/update',
    method: 'post',
    data: data
  })
}

export function deleteTask(id) {
  return request({
    url: '/sys/task/delete/' + id,
    method: 'get'
  })
}

export function createTask(data) {
  return request({
    url: '/sys/task/create',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/sys/task/updateStatus',
    method: 'post',
    data: data
  })
}

export function execTask(id) {
  return request({
    url: '/sys/task/exec/' + id,
    method: 'get'
  })
}
