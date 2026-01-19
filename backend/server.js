// server.js
import  http from 'http'
import crypto from 'crypto'
const PORT = 8080

// 假数据库（用户名 -> 密文密码）
const userMap = {
    admin: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' // 123456 的 SHA-256
}

// 工具：写 JSON 响应
function send(res, status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
}

// 工具：解析 POST JSON
function parseJson(req) {
    return new Promise((resolve, reject) => {
        let data = ''
        req.on('data', chunk => data += chunk)
        req.on('end', () => {
            try { resolve(JSON.parse(data)) }
            catch { reject(new Error('Bad JSON')) }
        })
    })
}

// 生成假 token
function genToken() {
    return 'mock-token-' + crypto.randomBytes(16).toString('hex')
}

// 路由处理
async function handle(req, res) {
    // 统一 CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

    if (req.method === 'OPTIONS') return res.writeHead(204), res.end()

    if (req.url === '/user/login' && req.method === 'POST') {
        try {
            const { username, password } = await parseJson(req)
            if (!username || !password) return send(res, 400, { message: '参数缺失' })

            // 校验密文
            if (userMap[username] !== password) {
                return send(res, 401, { message: '账号或密码错误' })
            }

            // 成功
            send(res, 200, {
                token: genToken(),
                userInfo: { id: 1, name: '管理员' },
                roles: ['admin'],
                menus: ['系统管理', '用户管理', '角色管理']
            })
        } catch (e) {
            send(res, 400, { message: e.message || '未知错误' })
        }
    } else {
        send(res, 404, { message: 'Not Found' })
    }
}

// 启动
http.createServer(handle).listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`)
})
