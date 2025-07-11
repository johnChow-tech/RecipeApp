# 简易食谱分享 (Simple Recipe Share)

这是一个小型的全栈Web应用，允许用户浏览和添加他们最喜欢的食谱。该项目的主要目的是作为一个学习载体，用于实践和深化现代前端与后端开发的核心概念。

## 核心学习目标 (Core Learning Objectives)

本项目旨在深入实践以下关键的软件工程概念：

1.  **前端组件化 (Frontend Componentization):**
    * 学习如何使用 Vue 3 将一个复杂的UI拆分为多个独立的、可复用的组件。
    * 实践组件间的通信：通过 `props` 进行父子数据传递，通过 `emits` 进行子父事件通知。
    * 目标组件：`<RecipeForm>`, `<RecipeList>`, `<RecipeCard>`。

2.  **后端模块化 (Backend Modularization):**
    * 学习如何将 Node.js/Express 应用的不同职责拆分到独立的模块中。
    * `server.js`: 只负责服务器的启动和中间件的配置。
    * `routes/`: 专门处理API的路由逻辑。
    * `database.js`: 封装所有与数据库的交互。

3.  **理论联系实践 (CS Fundamentals in Practice):**
    * **网络协议:** 深入理解和实践 `GET`, `POST` 等HTTP方法，设计符合RESTful规范的API。
    * **数据结构:** 在实践中理解 `Array` 和 `Object` 作为数据载体的不同应用场景。
    * **用户体验:** 有意识地设计和实现应用的 **加载(Loading)**、**错误(Error)** 和 **空状态(Empty)** 界面。

## 技术栈 (Tech Stack)

* **前端 (Frontend):** Vue 3 (通过 CDN 引入)
* **后端 (Backend):** Node.js, Express
* **数据库 (Database):** SQLite
* **API测试工具 (API Testing):** Postman (或同类工具)

## 如何运行 (Getting Started)

1.  **克隆仓库**
    ```bash
    git clone [你的仓库URL]
    ```

2.  **进入项目目录**
    ```bash
    cd [你的项目文件夹]
    ```

3.  **安装后端依赖**
    ```bash
    # 这将会安装 express 和 sqlite3
    npm install
    ```

4.  **启动后端服务器**
    ```bash
    node server.js
    # 终端会提示服务器正在运行，例如：Server is running on port 3000
    ```

5.  **在浏览器中打开**
    * 直接用浏览器打开项目中的 `index.html` 文件即可查看前端页面。

## 项目结构 (Project Structure)
```
.
├── README.md
├── database.js     # 数据库连接与初始化模块
├── index.html      # 前端主页面
├── main.js         # 前端 Vue 应用逻辑
├── package.json    # 项目依赖描述文件
├── routes
│   └── recipes.js  # 所有与“食谱”相关的路由
├── server.js       # Express 服务器主入口文件
└── style.css       # 前端样式表
```