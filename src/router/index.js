import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    { path: '/home', name: 'Home', component: () => import('@/views/Home.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()
    // 刷新页面后 Pinia 空了，先尝试恢复
    auth.restore()

    const isLogin = !!auth.token           // 是否已登录
    const isRemember = auth.hasRemember    // 是否勾过“记住我”
    const toLogin = to.path === '/login'   // 目标就是登录页
    const justLogout = sessionStorage.getItem('_logout_by_user') === '1'

    if (justLogout) return next()

    // 已登录 → 直接去目标
    if (isLogin) {
        return next() //toLogin ? next('/home') : next()
    }
    // 未登录但勾过“记住我” → 自动登录
    if (isRemember) {
        try {
            await auth.autoLogin()
            return next(to.fullPath) //toLogin ? next('/home') : next()
        } catch {
            auth.logout()
            return next('/login')
        }
    }
    // 未登录且无记住我
    return toLogin ? next() : next('/login')
})

export default router
