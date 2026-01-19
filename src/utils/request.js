import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 创建实例
const request = axios.create({
    baseURL: '/api',          // 后端地址，可配 .env
    timeout: 8000
})

// 请求拦截：统一带 token
request.interceptors.request.use(
    config => {
        const auth = useAuthStore()
        if (auth.token) {
            config.headers.Authorization = `Bearer ${auth.token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截：统一异常处理
request.interceptors.response.use(
    response => response.data,
    async error => {
        // 主动抛出的业务错误
        if (error.response?.data?.message) {
            return Promise.reject(new Error(error.response.data.message))
        }
        // 401 统一踢回登录
        if (error.response?.status === 401) {
            const auth = useAuthStore()
            auth.logout()
            router.replace('/')
            return Promise.reject(new Error('登录已失效'))
        }
        // 网络或其它
        const msg = error.message || '网络异常'
        return Promise.reject(new Error(msg))
    }
)

export default request
