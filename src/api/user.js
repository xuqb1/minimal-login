import request from '@/utils/request'
import { sha256 } from 'js-sha256'

/**
 * 登录
 * @param {string} username
 * @param {string} pwd   明文或密文
 * @param {boolean} encrypted  传入 true 表示 pwd 已是密文，无需再加密
 */
export async function login(username, pwd, encrypted = false) {
    const password = encrypted ? pwd : sha256(pwd)
    const res = await request({
        url: '/user/login',
        method: 'post',
        data: { username, password }
    })
    return res
}
