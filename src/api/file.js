import request from '@/utils/request'

export function uploadPhoto(data) {
  return request({
    url: '/resource/qiniu/file',
    method: 'post',
    data: data
  })
}
