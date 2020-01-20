// ==UserScript==
// @name         Mackolik Script
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  try to take over the world!
// @author       CodeRunner
// @match        http://arsiv.mackolik.com/Kunye
// @grant        none
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/assets/js/jquery-latest.js
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/assets/js/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/assets/js/bootstrap.min.js
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/assets/js/jquery.dataTables.min.js?v=3
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/assets/plugin/jstree/dist/jstree.min.js
// @require      https://raw.githubusercontent.com/emirakpala/mackolik/master/mackolik/mackolik-core.js?v=213
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL

// ==/UserScript==


$(document).ready(function () {
    setTimeout(function () {
        Main(true);
    }, 3000);
});


function Main(init) {
    if (init)
        mackolikCustom.pageInit();
    mackolikCustom.getJsonData(0, 0, mackolikCustom.initDataTable);
}
