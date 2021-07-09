import request from '@/utils/request'

export function getLogList(data) {
  return request({
    url: '/resource/operation/list',
    method: 'post',
    data: data
  })
}

export function getExceptionLogList(data) {
  return request({
    url: '/resource/sysExceptionLog/list',
    method: 'post',
    data: data
  })
}
