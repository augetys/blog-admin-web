import request from '@/utils/request'

export function getServerInfo() {
  return request({
    url: '/monitor/getServerInfo',
    method: 'get'
  })
}
