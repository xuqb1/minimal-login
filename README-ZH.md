# Vue3 + Vite + Pinia 登录工作流示例

一个极简却**可直接投产**的登录模板，功能一览：

- 登录（密码 SHA-256 加密）  
- “记住我” 7 天免登  
- 刷新 / 重开浏览器自动恢复登录  
- 退出登录（清会话，但保留“记住我”）  
- Axios 全局封装，401 拦截，异常兜底  
- 防无限重定向（区分主动退出与首次访问）  

无 UI 框架，无冗余代码——克隆即可运行。

---

## 项目结构
```code
\--src
  ├─ main.js
  ├─ router/index.js # 路由守卫 & 防死循环
  ├─ stores/auth.js # Pinia 核心
  ├─ api/user.js # 登录接口
  ├─ utils/request.js # Axios 实例
  ├─ views
  │   │
  │   ├─ Login.vue
  │   └─ Home.vue
  ├─ main.js
  └─ App.vue
 └─ vite.config.js

## 运行流程
```mermaid
flowchart TD
    A([进入网站]) --> B{sessionStorage 中存在 token?}
    B -->|是| C[跳转 /home]
    B -->|否| D{localStorage 中存在“记住我”?}
    D -->|否| E[留在 /login 显示表单]
    D -->|是| F{sessionStorage<br>_logout_by_user=1?}
    F -->|是| E
    F -->|否| G[使用加密密码自动登录]
    G --> H{成功?}
    H -->|是| C
    H -->|否| I[清除无效缓存]
    I --> E
    C --> J[/主页/]
    J --> K[点击退出]
    K --> L[清除 token 和会话<br>设置 _logout_by_user=1]
    L --> E

##快速开始
```bash
# 1. 安装依赖
npm i

# 2. 启动前端
npm run dev        # http://localhost:3000

# 3. 启动后端（零依赖 Mock 服务）
node backend/server.js   # http://localhost:8080
```

##后端
目录：backend/server.js
仅用于快速测试
```bash
npm i
npm run dev
```

##许可证
MIT © 2026 xuqb
