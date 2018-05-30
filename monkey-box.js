
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
    if (box.autosave) {
      try {
        if (box.autosave === 'local') {
          data = JSON.parse(localStorage.getItem(`monkey-box-${id}-data`))
        } else if (mv.autosave === 'global') {
          data = JSON.parse(GM_getValue(`monkey-box-${id}-data`))
        }
      } catch (e) {
        console.log(`[MonkeyBoxWarn]: load data error for ${$id}`)
      }
    }

    const vm = new Vue({
      ...box,
      el: `#monkey-box-${id}`,
      data: { ...box.data, ...data },
      template: `<div id="monkey-box-${id}" class="${isShow ? '' : 'monkey-box-hide'}">${box.template}</div>`
    })
    
    if (box.autosave) {
      let timer = null

      for (const key of Object.keys(vm.$data)) {
        vm.$watch(key, function () {
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (box.autosave === 'local') {
              localStorage.setItem(`monkey-box-${id}-data`, JSON.stringify(this.$data))
            } else if (box.autosave === 'global') {
              GM_setValue(`monkey-box-${id}-data`, JSON.stringify(this.$data))
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