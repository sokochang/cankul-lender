import request from '@/utils/request'
import qs from 'qs'

export function generate(data) {
    return request({
        url: '/lender/imgCode/generate',
        method: 'get',
        data
    })
}

export function login(data) {
    return request({
        url: '/lender/login',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function sendPhoneCode(data) {
    return request({
        url: '/lender/phone/sendCode',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function sendEmailCode(data) {
    return request({
        url: '/lender/email/sendCode',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function register(data) {
    return request({
        url: '/lender/register',
        method: 'post',
        data: qs.stringify(data)
    })
}
