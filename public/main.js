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
    return {
      recipes: [],
      isLoading: false,
      errorMsg: "",
    };
  },

  template: `
    <div>
      <recipe-form @add-recipe="onRecipeAdd($event)"></recipe-form>
      <div v-if="isLoading" class="loading-state">
        <p>正在加载食谱中，请稍候...</p>
      </div>
      <div v-else-if="errorMsg" class="error-state">
        <p>{{ errorMsg }}</p>
      </div>
      <recipe-list v-else :recipes="recipes" @delete-recipe="onRecipeDelete($event)"></recipe-list>
    </div>
  `,
  methods: {
    /** 应用启动时，从后端获取初始食谱列表
     * @param null
     */
    async fetchRecipes() {
      try {
        console.log("侦测点：开始调用 fetchRecipes() ...");
        this.isLoading = true;
        this.errorMsg = "";

        // 使用 fetch API 向我们的后端服务发送 GET 请求
        const response = await fetch("/api/recipes");

        if (!response.ok) {
          // 如果服务器返回的不是成功状态码 (比如 404, 500)，就抛出一个错误
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 将响应体解析为 JSON 格式
        const data = await response.json();
        this.isLoading = false;
        // 用从后端获取的数据，来更新我们组件的 recipes 数组
        this.recipes = data;
        console.log(
          "侦测点：数据获取成功，并已更新到 this.recipes:",
          this.recipes
        );
      } catch (error) {
        // 如果 fetch 过程中发生任何错误（比如网络不通），就在控制台打印出来
        this.isLoading = false;
        this.errorMsg = "无法加载食谱列表，请稍后重试。";
        console.error("获取食谱数据失败:", error);
        // 在这里，我们未来可以添加一些用户友好的错误提示，比如在页面上显示“加载失败”
      }
    },
    /**
     *  监听子组件的添加事件，负责更新 recipes 列表
     * @param {object}newRecipe -新增对象菜谱的object
     */
    async onRecipeAdd(newRecipe) {
      try {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newRecipe.title,
            description: newRecipe.description,
          }),
        });
        if (!response.ok) {
          // 如果服务器返回的不是成功状态码 (比如 404, 500)，就抛出一个错误
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const savedRecipe = await response.json();
        this.recipes.unshift(savedRecipe);
      } catch (error) {
        console.log(`ERROR:${error}`);
      }
    },
    /**
     * 监听子组件的删除事件，负责更新 recipes 列表
     * @param {number}idToDelete -删除对象菜谱的ID
     */
    async onRecipeDelete(idToDelete) {
      try {
        const response = await fetch(`/api/recipes/${idToDelete}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          // 如果服务器返回的不是成功状态码 (比如 404, 500)，就抛出一个错误
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.recipes = this.recipes.filter(
          (recipe) => recipe.id !== idToDelete
        );
      } catch (error) {
        console.log(`ERROR:${error}`);
      }
    },
  },
  mounted() {
    // 打印日志，确认钩子被调用
    console.log("侦测点：App 组件已被挂载到页面上，mounted() 钩子被触发！");
    // 当组件挂载后，我们立刻调用方法去获取数据
    this.fetchRecipes();
  },
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
     * 传递删除菜谱向上传递至父级组件app
     * @param {number}recipeidToDelete - 要删除的对象菜谱
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
      this.$emit("add-recipe", { ...newRecipe });
      // DEBUG
      console.log("newRecipe.title:" + newRecipe.title);
      console.log("newRecipe.description:" + newRecipe.description);
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
app.component("recipe-list", RecipeList);
app.component("recipe-card", RecipeCard);
app.component("recipe-form", RecipeForm);

// 3. 将组装好的应用，挂载到 HTML 页面上那个 <div id="app"></div> 的元素上
app.mount("#app");
