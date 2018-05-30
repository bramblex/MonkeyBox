

const fs = require('fs')
const package_json = require('./package.json')

const format = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const header = {
    name: package_json.name,
    author: `<${package_json.author.name}/${package_json.author.email}>`,
    version: package_json.version,
    description: package_json.description,
    supportURL: package_json.homepage,
    license: package_json.license,
    date: '2018-5-30',
    modified: format(new Date(), 'yyyy-MM-dd'),
    require: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js',
    grant: ['GM_setValue', 'GM_getValue', 'GM_removeValue'],
    match: ['*://*/*']
}

const body_code = fs.readFileSync(__dirname + '/monkey-box.user.js', 'utf-8')

const header_code = Object.entries(header).map(([key, value]) =>
    Array.isArray(value) ? value.map(v => `// @${key} ${v}`).join('\n') : `// @${key} ${value}`).join('\n')

fs.writeFileSync(__dirname + '/monkey-box.user.js',
    ['// ==UserScript==', header_code, '// ==/UserScript==', body_code].join('\n'))