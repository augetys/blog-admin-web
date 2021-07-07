import request from '@/utils/request'

export function getMailConfig() {
  return request({
    url: '/sys/configEmail/find',
    method: 'get'
  })
}

export function updateMail(data) {
  return request({
    url: '/sys/configEmail/update',
    method: 'post',
    data: data
  })
}
