import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/user'
import router from '@/router'
import { sha256 } from 'js-sha256'

export const useAuthStore = defineStore('auth', () => {
    // 核心状态
    const token = ref('')
    const userInfo = ref({})
    const roles = ref([])
    const menus = ref([])
    const hasRemember = ref(false)

    /* ---------- 恢复：刷新页面时调用 ---------- */
    function restore() {
        if (token.value) return // 已经恢复
        token.value = sessionStorage.getItem('token') || ''
        userInfo.value = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
        roles.value = JSON.parse(sessionStorage.getItem('roles') || '[]')
        menus.value = JSON.parse(sessionStorage.getItem('menus') || '[]')
        hasRemember.value = localStorage.getItem('remember') === 'true'
    }

    /* ---------- 登录 ---------- */
    async function login(form, remember = false) {
        try {
            const data = await loginApi(form.username, form.password)
            // 写 Pinia
            token.value = data.token
            userInfo.value = data.userInfo
            roles.value = data.roles
            menus.value = data.menus
            hasRemember.value = remember
            // 写缓存
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('userInfo', JSON.stringify(data.userInfo))
            sessionStorage.setItem('roles', JSON.stringify(data.roles))
            sessionStorage.setItem('menus', JSON.stringify(data.menus))
            if (remember) {
                const encrypted = sha256(form.password)   // 密文
                localStorage.setItem('username', form.username)
                localStorage.setItem('password', encrypted)
                localStorage.setItem('remember', 'true')
            } else {
                localStorage.removeItem('username')
                localStorage.removeItem('password')
                localStorage.removeItem('remember')
            }
            router.push('/home')
        } catch (e) {
            throw e
        }
    }

    /* ---- 自动登录 ---- */
    async function autoLogin() {
        const username = localStorage.getItem('username')
        const password = localStorage.getItem('password') // 这里是密文
        if (!username || !password) throw new Error('无记住我信息')

        // 直接传密文，告诉 api 层“已加密”
        const data = await loginApi(username, password, true)
        // 后续逻辑同 login
        token.value = data.token
        userInfo.value = data.userInfo
        roles.value = data.roles
        menus.value = data.menus
        hasRemember.value = true

        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        sessionStorage.setItem('roles', JSON.stringify(data.roles))
        sessionStorage.setItem('menus', JSON.stringify(data.menus))
        router.push('/home')
    }
    /* ---------- 退出 ---------- */
    function logout() {
        token.value = ''
        userInfo.value = {}
        roles.value = []
        menus.value = []
        sessionStorage.clear()
        sessionStorage.setItem('_logout_by_user', '1')
        // localStorage 保留记住我，不清
        localStorage.removeItem("username")
        localStorage.removeItem("password")
        router.push('/')
    }

    return {
        token, userInfo, roles, menus, hasRemember,
        restore, login, autoLogin, logout
    }
})
