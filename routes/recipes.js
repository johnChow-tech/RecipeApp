// routes/recipes.js

// 1. 引入 Express
const express = require("express");

// 2. 创建一个“路由”实例
// 这个 router 就像一个“微型”的 app，可以用来组织一组相关的路由
const router = express.Router();

// 模拟数据库中的数据 (暂时放在这里)
let recipes = [
  { id: 1, title: "番茄炒蛋", description: "家常菜" },
  { id: 2, title: "可乐鸡翅", description: "快手菜" },
];
let nextId = recipes.length + 1;

// 3. 定义这个模块的路由
// 注意：这里的路径是相对于在 server.js 中挂载它的路径
// 如果在 server.js 中 app.use('/api/recipes', ...)，那么这里的 '/' 就代表 '/api/recipes'

// GET /api/recipes - 获取所有食谱
router.get("/", (req, res) => {
  console.log("GET /api/recipes 被调用");
  res.json(recipes);
});

// POST /api/recipes - 添加一个新食谱
router.post("/", (req, res) => {
  const newRecipe = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description,
  };
  recipes.push(newRecipe);
  console.log("POST /api/recipes 被调用, 新增:", newRecipe);
  // RESTful 规范: 成功创建资源后，返回状态码 201 和新创建的资源
  res.status(201).json(newRecipe);
});

// DELETE /api/recipes/:id - 删除一个食谱
router.delete("/:id", (req, res) => {
  // 从 URL 中获取 id，并将其转换为数字
  const idToDelete = parseInt(req.params.id, 10);
  recipes = recipes.filter((recipe) => recipe.id !== idToDelete);
  console.log(`DELETE /api/recipes/${idToDelete} 被调用`);
  // RESTful 规范: 成功删除后，返回状态码 204 (No Content)
  res.status(204).send();
});

// 4. 导出这个路由模块，以便在 server.js 中使用
module.exports = router;
