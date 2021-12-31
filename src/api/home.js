import request from '@/utils/request'

export function getSoul() {
  return request({
    url: '/home/getSoul',
    method: 'get'
  })
}

export function getWeather() {
  return request({
    url: '/home/getWeather',
    method: 'get'
  })
}

export function getHistory() {
  return request({
    url: '/home/getHistory',
    method: 'get'
  })
}

export function getTotal() {
  return request({
    url: '/home/getTotal',
    method: 'get'
  })
}

export function getDay() {
  return request({
    url: '/home/getDay',
    method: 'get'
  })
}

export function getConstellation() {
  return request({
    url: '/home/getConstellation',
    method: 'get'
  })
}

export function getBook() {
  return request({
    url: '/home/getBook',
    method: 'get'
  })
}
