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
const App = {
  data() {
    // ... 在这里返回你的 recipes 数组 ...
  },
  methods: {
    onRecipeAdd() { },
    onRecipeDelete() { },
  },
  template: `
    <div>
      <h1>我的食谱书</h1>
      
      <recipe-form @add-recipe="..."></recipe-form>
      
      <hr>
      
      <recipe-list :recipes="..." @delete-recipe="..."></recipe-list>
      
    </div>
  `,
};

// 最后，你的 app 实例应该挂载这个 App 组件
// 2. 食谱列表组件 (RecipeList)
//    - 职责: 纯粹地展示食谱列表。
//    - props:
//        - recipes: Array // 从 App 接收要展示的食谱数组
//    - emits:
//        - delete-recipe(recipeId) // 当某个卡片的删除按钮被点击时，将事件继续向上传递
const RecipeList = {
  props: ["recipes"],
  emits: ["delete-recipe"],
  template: `
  <div class="recipe-list">
    <ul v-if="recipes.length > 0">
      <li v-for="recipe in recipes" :key="recipe.id">
        <recipe-card
          :recipe="recipe"
          @delete-me="handleDeleteRelay($event)"
        ></recipe-card>
      </li>
    </ul>
  </div>
  `,
  methods: {
    /**
     * 传递删除菜谱至父级组件app
     * @param recipeToDelete - 要删除的对象菜谱
     */
    handleDeleteRelay(recipeidToDelete) {
      this.$emit("delete-recipe", recipeidToDelete);
    },
  },
};

// 3. 食谱卡片组件 (RecipeCard)
//    - 职责: 纯粹地展示单个食谱的详细信息，并提供一个删除按钮。
//    - props:
//        - recipe: Object // 从 RecipeList 接收单个食谱对象
//    - emits:
//        - delete-me  // 当自己的删除按钮被点击时，通知父组件（RecipeList）
const RecipeCard = {
  // props: 用来声明该组件可以从父组件接收哪些数据
  // 我们期望从父组件那里接收一个名为 "recipe" 的对象
  props: ["recipe"],

  // emits: 用来声明该组件会触发哪些自定义事件
  // 我们声明会触发一个名为 "delete-me" 的事件
  emits: ["delete-me"],

  // template: 定义了这个组件的 HTML 结构和内容
  template: `
    <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <p>{{ recipe.description }}</p>
    <button @click="$emit('delete-me', recipe.id)">删除</button>
    </div>
    `,
};

// 4. 食谱表单组件 (RecipeForm)
//    - 职责: 采集用户信息，并在点击提交时，通过事件将新食谱数据发送出去。
//    - data (内部状态):
//        - newTitle: ''
//        - newDescription: ''
//    - props:
//        - none
//    - emits:
//        - add-recipe(newRecipeObject) // 当表单提交时，触发此事件，并附带上包含 title 和 description 的新对象
const RecipeForm = {
  data() {
    return {
      newRecipe: {
        title: "",
        description: "",
      },
    };
  },
  emits: ["add-recipe"],
  template: `
  <div class="recipe-form">
    <input type="text" v-model="newRecipe.title"/>
    <input type="text" v-model="newRecipe.description"/>
    <button @click="handleAddRelay">上传菜谱</button>
  </div>
  `,
  methods: {
    handleAddRelay() {
      const newRecipe = this.newRecipe;
      if (!newRecipe.title || !newRecipe.description) {
        alert("请输入菜谱名和菜谱描述");
        return;
      }
      this.$emit("add-recipe", newRecipe);
      // 初期化输入框
      newRecipe.title = "";
      newRecipe.description = "";
    },
  },
};

// =======================================================
// FINAL ASSEMBLY - 最终组装
// =======================================================

// 1. 创建 Vue 应用实例，并告诉它我们的根组件是 App
const app = Vue.createApp(App);

// 2. 将我们定义的所有子组件，作为“零件”，注册到 App 实例上
//    这样 App 的模板在看到 <recipe-list> 等标签时，才知道它们是什么
app.component('recipe-list', RecipeList);
app.component('recipe-card', RecipeCard);
app.component('recipe-form', RecipeForm);

// 3. 将组装好的应用，挂载到 HTML 页面上那个 <div id="app"></div> 的元素上
app.mount('#app');