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
// ==/UserScript==
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var MonkeyBox = function () {

  var counter = function () {
    var c = 0;
    return function () {
      return ++c;
    };
  }();

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
    main.className = main.className === 'monkey-hide' ? '' : 'monkey-hide';
    document.getElementById('monkey-container').className = main.className;
  }

  function addBox(box) {
    var id = counter();
    var name = box.name || id.toString();
    var template = '\n      <div id="monkey-box-wapper" class="monkey-box">\n          ' + (box.style ? '<style>' + addIdToStyle('monkey-box-' + id, box.style) + '</style>' : '') + ' \n          <div id="monkey-box-' + id + '-title" class="monkey-box-title">' + name + '</div>\n          <div id="monkey-box-' + id + '"></div>\n      </div>\n    ';
    var tmp = document.createElement('div');
    tmp.innerHTML = template.trim();
    document.getElementById('monkey-container').appendChild(tmp.firstChild);

    document.getElementById('monkey-box-' + id + '-title').onclick = function () {
      var box = document.getElementById('monkey-box-' + id);
      box.className = box.className === 'monkey-box-hide' ? '' : 'monkey-box-hide';
    };

    return new Vue(_extends({}, box, { el: '#monkey-box-' + id, template: '<div id="monkey-box-' + id + '">' + box.template + '</div>' }));
  }

  if (!document.getElementById('monkey-main')) {
    createMonkeyBox();
  }

  return { addBox: addBox, showHide: showHide };
}();
