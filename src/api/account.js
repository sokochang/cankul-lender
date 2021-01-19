import request from '@/utils/request'
import qs from 'qs'

export function digisignRegister(data) {
	return request({
		headers: {
			"token": sessionStorage.getItem('token')
		},
		url: '/lender/auth/digisign/register',
		method: 'post',
		data: qs.stringify(data)
	})
}

export function digisignActive(data) {
	return request({
		headers: {
			"token": sessionStorage.getItem('token')
		},
		url: '/lender/auth/digisign/active',
		method: 'post',
		data: qs.stringify(data)
	})
}

export function signCankul(data) {
	return request({
		headers: {
			"token": sessionStorage.getItem('token')
		},
		url: '/lender/auth/sign/cankul',
		method: 'post',
		data: qs.stringify(data)
	})
}
