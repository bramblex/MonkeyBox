# MonkeyBox

基于 vue 的简易有猴子 ui 框架

## 使用方法

1. 首先创建一个油猴子脚本，并且添加如下代码进入 metadata

```JavaScript
// @require https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js
// @require https://greasyfork.org/scripts/368779-monkey-box/code/monkey-box.js
```

2. 用 `MonkeyBox.addBox(id: string, vue: VueComponet)` 在 MonkeyBox 里添加组件

``` JavaScript
MonkeyBox.addBox('hellobox', {
    // 自动保存 data (可选)
    autosave: 'local' | 'global' ,

    // 自动转换成带 scope 的css (可选)
    style: `
        button {
            color: red;
        }
    `,

    // vue 模板
    template: '<button @click="sayHello">{{ text }}</button>', 

    // 数据模型
    data: {
        msg: 'hello'
    },

    // 定义方法
    methods: {
        sayHello() {
            alert('hello')
        },

        testApi() {
        // 绑在 vm 中的 API
            this.loadGlobalData()
            this.loadLocalData()
            this.saveGlobalData(data)
            this.saveLocalData(data)
            this.clearLocalData()
            this.clearGlobalData()
        }
    }

})
```