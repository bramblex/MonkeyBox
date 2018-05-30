
const MonkeyBox = (() => {

  const monkey_style = `
    #monkey-main { position: fixed; background-color: #EFEFEF; min-width: 200px; right: 0; top: 80px; z-index: 10000; }
    #monkey-main.monkey-hide { min-width: 0; width: 0; }
    #monkey-button { margin-left: -1.5em; cursor: pointer; }
    #monkey-container { width: 100%; overflow-x: hidden; }
    #monkey-container.monkey-hide { display: none; }
    #monkey-title { border-bottom: black 1px solid; font-size: 1.2em; }
    .monkey-box { border-bottom: black 1px solid; }
    .monkey-box-title { cursor: pointer; border-bottom: white 2px solid; text-align: center; }
    .monkey-box-hide { overflow-y: hidden; height: 0; }
  `

  const monkey_template = `
    <div id="monkey-main" class="monkey-hide">
      <div id="monkey-title"> <b id="monkey-button"> M </b> | MonkeyBox </div>
      <div id="monkey-container" class="monkey-hide"></div>
    </div>
  `

  function addIdToStyle(id, style) {
    return (style.replace(/(^|})\s*([^]*?)\s*\{/g, `$1\n#${id} $2 {`).trim())
  }

  function createElement(html) {
    const el = document.createElement('div')
    el.innerHTML = html.trim()
    return el.firstChild
  }

  function createMonkeyBox() {
    const style = createElement(`<style>${monkey_style}</style>`)
    const main = createElement(monkey_template)

    document.body.appendChild(style)
    document.body.appendChild(main)

    document.getElementById('monkey-button').onclick = () => showHide()
  }

  function showHide() {
    const main = document.getElementById('monkey-main')
    if (main.className === 'monkey-hide') {
      main.className = ''
      localStorage.setItem('monkey-main-show', '1')
    } else {
      main.className = 'monkey-hide'
      localStorage.removeItem('monkey-main-show')
    }
    document.getElementById('monkey-container').className = main.className
  }

  function loadLocalData(id) {
    try {
      return JSON.parse(localStorage.getItem(`monkey-box-${id}-data`))
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  function loadGlobalData(id) {
    try {
      return JSON.parse(GM_getValue(`monkey-box-${id}-data`))
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  function saveLocalData(id, data) {
    localStorage.setItem(`monkey-box-${id}-data`, JSON.stringify(data))
  }

  function saveGlobalData(id, data) {
    GM_setValue(`monkey-box-${id}-data`, JSON.stringify(data))
  }

  function clearLocalData(id, data) {
    localStorage.removeItem(`monkey-box-${id}-data`)
  }

  function clearGlobalData(id, data) {
    GM_removeValue(`monkey-box-${id}-data`)
  }

  function addBox(id, box) {
    const name = box.name || id
    const template = `
      <div id="monkey-box-wapper" class="monkey-box">
          ${box.style ? `<style>${addIdToStyle(`monkey-box-${id}`, box.style)}</style>` : ''} 
          <div id="monkey-box-${id}-title" class="monkey-box-title">${name}</div>
          <div id="monkey-box-${id}"></div>
      </div>
    `
    const tmp = document.createElement('div')
    tmp.innerHTML = template.trim()
    document.getElementById('monkey-container').appendChild(tmp.firstChild)


    document.getElementById(`monkey-box-${id}-title`).onclick = function () {
      const box = document.getElementById(`monkey-box-${id}`)
      if (box.className === 'monkey-box-hide') {
        box.className = ''
        localStorage.setItem(`monkey-box-${id}-show`, '1')
      } else {
        box.className = 'monkey-box-hide'
        localStorage.removeItem(`monkey-box-${id}-show`)
      }
    }

    const isShow = localStorage.getItem(`monkey-box-${id}-show`)

    let data = {}
    if (box.autosave === 'local') {
      data = loadLocalData(id) || data
    } else if (box.autosave === 'global') {
      data = loadGlobalData(id) || data
    }

    const mixin = {
      data: box.data,
      methods: {
        loadGlobalData() { return loadGlobalData(id) },
        loadLocalData() { return loadLocalData(id) },
        saveGlobalData(data) { return saveGlobalData(id, data) },
        saveLocalData(data) { return saveLocalData(id, data) },
        clearLocalData() { return clearLocalData(id) },
        clearGlobalData() { return clearGlobalData(id) }
      }
    }

    const vm = new Vue({
      ...box,
      data,
      el: `#monkey-box-${id}`,
      template: `<div id="monkey-box-${id}" class="${isShow ? '' : 'monkey-box-hide'}">${box.template}</div>`,
      mixins: [mixin]
    })

    if (box.autosave) {
      let timer = null

      for (const key of Object.keys(vm.$data)) {
        vm.$watch(key, function () {
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (box.autosave === 'local') {
              this.saveLocalData(this.$data)
            } else if (box.autosave === 'global') {
              this.saveGlobalData(this.$data)
            }
          }, 300)
        }, { deep: true })
      }

    }

    return vm
  }

  if (!document.getElementById('monkey-main')) {
    createMonkeyBox()
    if (localStorage.getItem('monkey-main-show')) showHide()
  }

  return { addBox, showHide }

})()