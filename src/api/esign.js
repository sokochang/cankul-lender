import request from '@/utils/request'
import qs from 'qs'

export function getList(data) {
	return request({
		headers: {
			"token": sessionStorage.getItem('token')
		},
		url: '/lender/auth/doc/list',
		method: 'post',
		data: qs.stringify(data)
	})
}

export function batchSign(data) {
	return request({
		headers: {
			"token": sessionStorage.getItem('token')
		},
		url: '/lender/auth/doc/sign/batch',
		method: 'post',
		data: qs.stringify(data)
	})
}
