

class MonkeyBox {

  static addIdToStyle(id, style) {
    return (style.replace( /(^|})\s*([^]*?)\s*\{/g, `$1\n#${id} $2 {`).trim())
  }

  create() {

    // 格子模板
    const template = `
      <style>
        #monkey-main {
          position: fixed;
          background-color: #EFEFEF;
          min-width: 200px;
          right: 0;
          top: 80px;
          z-index: 10000;
        }

        #monkey-main.monkey-hide {
          min-width: 0;
          width: 0;
        }

        #monkey-button {
          margin-left: -1.5em;
          cursor: pointer;
        }

        #monkey-container {
          width: 100%;
          overflow-x: hidden;
        }

        #monkey-container.monkey-hide {
          display: none;
        }

        #monkey-title {
          border-bottom: black 1px solid;
          font-size: 1.2em;
        }

        .monkey-box {
          border-bottom: black 1px solid;
        }

        .monkey-box-title {
          cursor: pointer;
          border-bottom: white 2px solid;
          text-align: center;
        }

        .monkey-box-hide {
          // display: none;
          overflow-y: hidden;
          height: 0;
        }

      </style>

      <div id="monkey-main" class="monkey-hide">
        <div id="monkey-title">
          <b id="monkey-button"> M </b>| MonkeyBox
        </div>
        <div id="monkey-container" class="monkey-hide">
        </div>
      </div>
    `

    // 创建格子
    const tmp = document.createElement('div')
    tmp.innerHTML = template.trim()
    const style = tmp.firstChild
    const el = tmp.lastChild
    document.body.appendChild(style)
    document.body.appendChild(el)

    // 绑定格子事件
    document.getElementById('monkey-button').onclick = () => this.showHide() 
  }

  showHide() {
    const box = document.getElementById('monkey-main')
    box.className = box.className === 'monkey-hide' ? '' : 'monkey-hide'
    document.getElementById('monkey-container').className = box.className
  }

  addBox(id, name, box) {
    const template = `
      <div id="monkey-box-${id}" class="monkey-box">
          ${box.style ? `<style>${MonkeyBox.addIdToStyle(id, box.style)}</style>` : ''} 
          <div id="monkey-box-${id}-title" class="monkey-box-title">${name}</div>
          <div id="${id}"></div>
      </div>
    `
    const tmp = document.createElement('div')
    tmp.innerHTML = template.trim()
    document.getElementById('monkey-container').appendChild(tmp.firstChild)

    document.getElementById(`monkey-box-${id}-title`).onclick = function () {
      const box = document.getElementById(id)
      box.className = box.className === 'monkey-box-hide' ? '' : 'monkey-box-hide'
    }

    box.template = `<div id="${id}">${box.template}</div>`

    box.el = `#${id}`
    const vm = new Vue(box)
    return vm;
  }

  constructor() {
    if (!document.getElementById('monkey-main')) {
      this.create()
    }
  }
}

const main = new MonkeyBox()

main.addBox('hello-box', 'HelloBox', {

  template: `
    <div class="hello">
      <input v-model="msg" />
      <div> {{ msg }} </div>
    </div>
  `,

  data: {
    msg: 'hello'
  }

})

const main2 = new MonkeyBox()

main2.addBox('test-box', 'TestBox', {
  template: '<div>Test</div>'
})