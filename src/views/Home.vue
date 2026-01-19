<template>
    <div class="home">
        <h2>主页</h2>
        <p>欢迎：{{ auth.userInfo.name }}</p>
        <p>角色：{{ auth.roles.join(', ') }}</p>
        <p>菜单：{{ auth.menus.join(' | ') }}</p>
        <button @click="auth.logout()">退出登录</button>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.home {
    width: 300px;
    padding: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.home p {
    width: 100%;
    margin-left: 20px;
    text-align: left;
}

button {
    margin-top: 20px;
}
</style>
