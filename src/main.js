import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// ===== 全局异常处理 =====
app.config.errorHandler = (err, vm, info) => {
    console.error('[Global Vue Error]', err, info)
    // 这里可以上报 sentry / 弹Toast / 发埋点
}

// 可选：全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
    console.warn('[Global Vue Warn]', msg, trace)
}

// 普通 JS 运行时错误
window.onerror = (msg, source, line, col, err) => {
    console.error('[Window Error]', msg, err)
}

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', e => {
    console.error('[Unhandled Rejection]', e.reason)
})


app.use(createPinia())
app.use(router)
app.mount('#app')
