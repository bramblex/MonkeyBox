
const Vue = require('vue/dist/vue.common')

const monkeyStyle = `
  #monkey-box {
    width: 180px;

    position: fixed;
    top: 25%;
    right: 0;

    font-size: 16px;
    line-hight: 18px;
    letter-space: normal;
    color: black;

    border: 2px solid orange;
  }

  #monkey-box-button {
    position: absolute;
    width: 24px;
    height: 24px;
    left: -28px;
    top: 4px;
    text-align: center;
    line-height: 24px;
    fonts-size: 22px;
    background: orange;
    color: white;

    user-select: none;
    cursor: pointer;
  }

  #monkey-box-list {
    max-height: 360px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .monkey-box-container {
    padding: 4px;
    border-bottom: 2px solid orange;
  }

  .monkey-box-title {
    text-align: center;
    user-select: none;
    border-bottom: 1px solid #fff0c9;
  }
`

const monkeyTemplate = `
<div :style="{ right: hidden ? '-184px': 0 }" id="monkey-box">
  <div :style="{ opacity: hidden ? 0.3 : 1 }" id="monkey-box-button" @click="toggle">M</div>

  <div id="monkey-box-list">
    <div class="monkey-box-container" :key="box.id" v-for="box in boxes">
      <div class="monkey-box-title">
        {{ box.title }}
      </div>
      <div :id="'monkey-box-component-' + box.id" class="monkey-box-body">
        <component :is="box.component"></component>
      </div>
    </div>
  </div>

</div>
`

interface MonkeyBoxComponent {
  name?: string,
  style?: string,
  template?: string
}

export class MonkeyBox {
  private readonly vm: any

  private createStyle(styleString: string, scope?: string) {
    const style = document.createElement('style')
    style.innerText = scope ? (styleString.replace(/(^|})\s*([^]*?)\s*\{/g, `$1\n${scope} $2 {`).trim()) : styleString
    document.head.appendChild(style)
  }

  constructor() {
    this.createStyle(monkeyStyle)

    const el = document.createElement('div')
    el.id = 'monkey-box'
    document.body.appendChild(el)

    this.vm = new Vue({
      el,
      template: monkeyTemplate,
      data: {
        boxes: [],
        hidden: true
      },
      methods: {
        toggle(this: any) { this.hidden = !this.hidden }
      }
    })
  }

  public register(id: string, title: string, component: MonkeyBoxComponent) {
    if (!/^[0-9A-Za-z_]+$/.test(id)) {
      throw new Error(`Invalid id ${id}.`)
    }
    component.name = id
    component.template = component.template || '<div>(Empty Body)</div>'
    if (component.style) {
      this.createStyle(component.style, '#monkey-box-component-' + id)
    }
    this.vm.$data.boxes.push({ id, title, component })
    return this
  }
}