<template>
    <div class="login">
        <h2>登录</h2>
        <!-- 已登录（刷新）只给按钮 -->
        <div v-if="auth.token" style="display:flex;justify-content: center;align-items:center;">
            <span>您已登录，</span><button class="plain-button" @click="$router.push('/home')">进入主页</button>
        </div>
        <!-- 未登录或登录失败显示表单 -->
        <div v-else style="display:flex;flex-direction: column;">
            <form @submit.prevent="handleLogin">
                <div class="form-item">
                    <span>用户名</span>
                    <input v-model="form.username" />
                </div>
                <div class="form-item">
                    <span>密码</span>
                    <input type="password" v-model="form.password" />
                </div>
                <div class="form-item">
                    <span></span>
                    <label style="display:inline-flex;align-items: center;gap:4px;cursor:pointer;margin:0;padding:0;">
                        <input type="checkbox" v-model="remember" />
                        <div>记住我</div>
                    </label>
                </div>
                <button type="submit">登录</button>
                <p v-if="err" style="color:red">{{ err }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const form = reactive({ username: 'admin', password: '123456' })
const remember = ref(false)
const err = ref('')

async function handleLogin() {
    err.value = ''
    try {
        await auth.login(form, remember.value)
    } catch (e) {
        err.value = e.message
    }
}
onMounted(() => {
    if (localStorage.getItem("remember") === 'true') {
        remember.value = true
    }
})
</script>

<style scoped>
.login {
    width: 300px;
    /* margin: 80px auto; */
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
}

/* input {
    width: 100%;
    margin-bottom: 10px;
} */

.plain-button {
    width: 130px;
    border: 1px solid #eee;
}

.plain-button:hover {
    color: #eee;
    border: 1px solid #888;
    background-color: #1b2fcc;
}

.form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.form-item span {
    width: 80px;
    font-size: 14px;
    text-align: right;
    margin-right: 10px;
}

.form-item input {
    height: 20px;
}
</style>
