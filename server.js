// server.js

// 1. 引入依赖
const express = require('express');
const path = require('path');

// 2. 引入我们自己编写的路由模块
//    注意这里的路径 './routes/recipes'
const recipesRouter = require('./routes/recipes');

// 3. 创建 Express 应用实例
const app = express();
const PORT = 3100;

// 4. 设置中间件 (Middleware)
//    express.json() 用于解析请求体中的 JSON 数据 (比如前端 POST 过来的数据)
app.use(express.json()); 
//    express.static() 用于提供静态文件服务（比如 HTML, CSS, 前端JS）
//    这会让 public 目录下的所有文件都可以通过根 URL 访问
app.use(express.static(path.join(__dirname, 'public')));

// 5. 挂载路由模块
//    这行代码的意思是：所有以 '/api/recipes' 开头的请求，
//    都请转交给 recipesRouter 来处理。
app.use('/api/recipes', recipesRouter);

// 6. 启动服务器
app.listen(PORT, () => {
    console.log(`后端服务已启动，正在监听 http://localhost:${PORT}`);
});