// ==UserScript==
// @name         Mackolik Script
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  try to take over the world!
// @author       CodeRunner
// @match        http://arsiv.mackolik.com/Kunye
// @grant        none
// @require      http://localhost/betminer/assets/js/jquery-latest.js
// @require      http://localhost/betminer/assets/js/jquery-ui.min.js
// @require      http://localhost/betminer/assets/js/bootstrap.min.js
// @require      http://localhost/betminer/assets/js/jquery.dataTables.min.js?v=3
// @require      http://localhost/betminer/assets/plugin/jstree/dist/jstree.min.js
// @require      http://localhost/betminer/mackolik/mackolik-core.js?v=212
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
