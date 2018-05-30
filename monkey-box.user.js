// ==UserScript==
// @name monkey-box
// @author <bramblex/qjnight@gmail.com>
// @version 0.0.1
// @description 
// @supportURL https://github.com/bramblex/MonkeyBox
// @license MIT
// @date 2018-5-30
// @modified 2018-05-30
// @require https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js
// @grant GM_setValue
// @grant GM_getValue
// @match *://*/*
// ==/UserScript==
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var MonkeyBox = function () {

  var monkey_style = '\n    #monkey-main { position: fixed; background-color: #EFEFEF; min-width: 200px; right: 0; top: 80px; z-index: 10000; }\n    #monkey-main.monkey-hide { min-width: 0; width: 0; }\n    #monkey-button { margin-left: -1.5em; cursor: pointer; }\n    #monkey-container { width: 100%; overflow-x: hidden; }\n    #monkey-container.monkey-hide { display: none; }\n    #monkey-title { border-bottom: black 1px solid; font-size: 1.2em; }\n    .monkey-box { border-bottom: black 1px solid; }\n    .monkey-box-title { cursor: pointer; border-bottom: white 2px solid; text-align: center; }\n    .monkey-box-hide { overflow-y: hidden; height: 0; }\n  ';

  var monkey_template = '\n    <div id="monkey-main" class="monkey-hide">\n      <div id="monkey-title"> <b id="monkey-button"> M </b> | MonkeyBox </div>\n      <div id="monkey-container" class="monkey-hide"></div>\n    </div>\n  ';

  function addIdToStyle(id, style) {
    return style.replace(/(^|})\s*([^]*?)\s*\{/g, '$1\n#' + id + ' $2 {').trim();
  }

  function createElement(html) {
    var el = document.createElement('div');
    el.innerHTML = html.trim();
    return el.firstChild;
  }

  function createMonkeyBox() {
    var style = createElement('<style>' + monkey_style + '</style>');
    var main = createElement(monkey_template);

    document.body.appendChild(style);
    document.body.appendChild(main);

    document.getElementById('monkey-button').onclick = function () {
      return showHide();
    };
  }

  function showHide() {
    var main = document.getElementById('monkey-main');
    if (main.className === 'monkey-hide') {
      main.className = '';
      localStorage.setItem('monkey-main-show', '1');
    } else {
      main.className = 'monkey-hide';
      localStorage.removeItem('monkey-main-show');
    }
    document.getElementById('monkey-container').className = main.className;
  }

  function addBox(id, box) {
    var name = box.name || id;
    var template = '\n      <div id="monkey-box-wapper" class="monkey-box">\n          ' + (box.style ? '<style>' + addIdToStyle('monkey-box-' + id, box.style) + '</style>' : '') + ' \n          <div id="monkey-box-' + id + '-title" class="monkey-box-title">' + name + '</div>\n          <div id="monkey-box-' + id + '"></div>\n      </div>\n    ';
    var tmp = document.createElement('div');
    tmp.innerHTML = template.trim();
    document.getElementById('monkey-container').appendChild(tmp.firstChild);

    document.getElementById('monkey-box-' + id + '-title').onclick = function () {
      var box = document.getElementById('monkey-box-' + id);
      if (box.className === 'monkey-box-hide') {
        box.className = '';
        localStorage.setItem('monkey-box-' + id + '-show', '1');
      } else {
        box.className = 'monkey-box-hide';
        localStorage.removeItem('monkey-box-' + id + '-show');
      }
    };

    var isShow = localStorage.getItem('monkey-box-' + id + '-show');

    var data = {};
    if (box.autosave) {
      try {
        if (box.autosave === 'local') {
          data = JSON.parse(localStorage.getItem('monkey-box-' + id + '-data'));
        } else if (box.autosave === 'global') {
          data = JSON.parse(GM_getValue('monkey-box-' + id + '-data'));
        }
      } catch (e) {
        console.log('[MonkeyBoxWarn]: load data error for ' + id);
      }
    }

    var vm = new Vue(_extends({}, box, {
      el: '#monkey-box-' + id,
      data: _extends({}, box.data, data),
      template: '<div id="monkey-box-' + id + '" class="' + (isShow ? '' : 'monkey-box-hide') + '">' + box.template + '</div>'
    }));

    if (box.autosave) {
      (function () {
        var timer = null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(vm.$data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            vm.$watch(key, function () {
              var _this = this;

              clearTimeout(timer);
              timer = setTimeout(function () {
                if (box.autosave === 'local') {
                  localStorage.setItem('monkey-box-' + id + '-data', JSON.stringify(_this.$data));
                } else if (box.autosave === 'global') {
                  GM_setValue('monkey-box-' + id + '-data', JSON.stringify(_this.$data));
                }
              }, 300);
            }, { deep: true });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      })();
    }

    return vm;
  }

  if (!document.getElementById('monkey-main')) {
    createMonkeyBox();
    if (localStorage.getItem('monkey-main-show')) showHide();
  }

  return { addBox: addBox, showHide: showHide };
}();
