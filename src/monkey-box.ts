import { Cache } from './cache'
import { GMStore } from './gm-store'

const Vue = require('vue/dist/vue.common')

const monkeyColor = '#392f41'

const monkeyStyle = `
  #monkey-box {
    width: 180px;

    position: fixed;
    z-index: 10000;
    top: 25%;
    right: 0;
    transition: right 0.3s;

    font-size: 16px;
    line-hight: 18px;
    letter-space: normal;
    color: black;

    border: 2px solid ${monkeyColor};
    background: #FFF;
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
    background: ${monkeyColor};
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
    border-bottom: 1px solid ${monkeyColor};
  }

  .monkey-box-container:last-child {
    border-bottom: none;
  }

  .monkey-box-title {
    text-align: center;
    user-select: none;
    border-bottom: 1px solid #EFEFEF;
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

const monkeyBoxCache = new Cache('monkey_box', GMStore);

export class MonkeyBox {
  private readonly vm: any

  private createStyle(styleString: string, scope?: string) {
    const style = document.createElement('style')
    style.innerText = scope ? (styleString.replace(/(^|})\s*([^]*?)\s*\{/g, `$1\n${scope} $2 {`).trim()) : styleString
    document.head.appendChild(style)
  }

  public utils = {
    Cache,
    GMStore,
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
        toggle(this: { hidden: boolean }) {
          this.hidden = !this.hidden;
          monkeyBoxCache.set('hidden', this.hidden);
        }
      },
      create(this: { hidden: boolean }) {
        this.hidden = monkeyBoxCache.get('hidden') || true;
        GMStore.watch(monkeyBoxCache.createCacheKey('hidden'), (_, __, newValue) => {
          try {
            this.hidden = JSON.parse(newValue);
          } catch (err) {
            // ignore
          }
        })
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