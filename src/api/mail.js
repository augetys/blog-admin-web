import request from '@/utils/request'

export function sendMailContent(data) {
  return request({
    url: '/tool/emailContent/send',
    method: 'post',
    data: data
  })
}
