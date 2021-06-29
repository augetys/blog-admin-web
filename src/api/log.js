import request from '@/utils/request'

export function getLogList(data) {
  return request({
    url: '/sys/log/list',
    method: 'post',
    data: data
  })
}
