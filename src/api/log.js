import request from '@/utils/request'

export function getLogList(data) {
  return request({
    url: '/log/operation/list',
    method: 'post',
    data: data
  })
}

export function getExceptionLogList(data) {
  return request({
    url: '/log/sysExceptionLog/list',
    method: 'post',
    data: data
  })
}
