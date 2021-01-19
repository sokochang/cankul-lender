import request from '@/utils/request'

export function authInfoSubmit(data) {
  return request({
    headers:{
      "token": sessionStorage.getItem('token')
    },
    url: '/lender/auth/info/submit',
    method: 'post',
    data: data
  })
}
