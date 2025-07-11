// 模拟从服务器获取的食谱数据 (Mock Data)
const mockRecipes = [
  {
    id: 1,
    title: "番茄炒蛋",
    description: "一道简单美味的家常菜，富含蛋白质和维生素。",
  },
  {
    id: 2,
    title: "可乐鸡翅",
    description: "甜咸可口，深受孩子们喜爱的一道快手菜。",
  },
  {
    id: 3,
    title: "清炒西兰花",
    description: "健康清淡，保持了西兰花的爽脆和营养。",
  },
];

// --- 组件设计蓝图 ---

/**
+-------------------------------+
| App                           |
| +---------------------------+ |
| | +-----------------------+ | |
| | | title             [x] |<----------食谱卡片组件 (RecipeCard1)
| | | description           | | | 
| | +-----------------------+ |<-------食谱列表组件 (RecipeList)  
| | +-----------------------+ | | 
| | | title             [x] |<----------食谱卡片组件 (RecipeCard2)
| | | description           | | | 
| | +-----------------------+ | | 
| +---------------------------+ |
|   +-----------------------+   | 
|   | [title            ]   |   |
|   | [description      ]   |   |
|   |   -----------------   |<----------食谱表单组件 (RecipeForm)
|   |      +------+         |   |
|   |      |submit|         |   |
|   |      +------+         |   |
|   +-----------------------+   | 
+-------------------------------+
 */

// 1. 根应用 (App)
//    - 数据 (data):
//        - recipes: []  // 唯一的、权威的食谱列表数据源
//    - 方法 (methods):
//        - onRecipeAdd(newRecipe): // 监听子组件的添加事件，负责更新 recipes 列表
//        - onRecipeDelete(recipeId): // 监听子组件的删除事件，负责更新 recipes 列表
//        - fetchRecipes(): // 应用启动时，从后端获取初始食谱列表
// 
// 2. 食谱列表组件 (RecipeList)
//    - 职责: 纯粹地展示食谱列表。
//    - props:
//        - recipes: Array // 从 App 接收要展示的食谱数组
//    - emits:
//        - delete-recipe(recipeId) // 当某个卡片的删除按钮被点击时，将事件继续向上传递
// 
// 3. 食谱卡片组件 (RecipeCard)
//    - 职责: 纯粹地展示单个食谱的详细信息，并提供一个删除按钮。
//    - props:
//        - recipe: Object // 从 RecipeList 接收单个食谱对象
//    - emits:
//        - delete-me // 当自己的删除按钮被点击时，通知父组件（RecipeList）
// 
// 4. 食谱表单组件 (RecipeForm)
//    - 职责: 采集用户信息，并在点击提交时，通过事件将新食谱数据发送出去。
//    - data (内部状态):
//        - newTitle: ''
//        - newDescription: ''
//    - props:
//        - none
//    - emits:
//        - add-recipe(newRecipeObject) // 当表单提交时，触发此事件，并附带上包含 title 和 description 的新对象
