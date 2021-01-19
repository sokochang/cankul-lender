import request from '@/utils/request'

export function getAccountState(data) {
  return request({
    headers:{
      "token": sessionStorage.getItem('token')
    },
    url: '/lender/auth/account/state',
    method: 'get',
    params: data
  })
}
