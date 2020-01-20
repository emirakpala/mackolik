// ==UserScript==
// @name         Rivalo Script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Rivalo Easy Use!
// @author       CodeRunner
// @match        https://www.1x2riv.com/*
// @exclude      https://www.1x2riv.com/login/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @require      https://cdn.datatables.net/1.10.18/js/jquery.dataTables.min.js
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// ==/UserScript==


$(document).ready(function () {
    setTimeout(function () {
        rivaloCore.init();
    }, 3000);
});

var rivaloCore = {
    rivaloFootballUrl: "/tr/spor-bahisleri/futbol/gbbab/",
    storageEventKey: "rivaloEvents",
    init: function () {
        //rivaloCore.initResources();
        rivaloCore.initNavigation();
        rivaloCore.initBindings();
        if (window.location.href.indexOf(rivaloCore.rivaloFootballUrl) != -1)
            rivaloCore.initToolBox();
    },
    getEventJson: function () {
        var data = localStorage.getItem(rivaloCore.storageEventKey);
        var json = [];
        if (!(data === null))
            json = JSON.parse(data);
        return json;
    },
    setEventJson: function (json) {
        localStorage.setItem(rivaloCore.storageEventKey, JSON.stringify(json));
    },
    grab: function (list) {
        $(".jq-event-row-cont").each(function (index) {
            var item = {};
            item.eventName = $(this).find("meta[itemprop='name']").attr("content");
            item.tournamentName = $(this).find("meta[itemprop='description']").attr("content");
            item.eventDate = $(this).find("meta[itemprop='startDate']").attr("content");
            item.homeParticipantName = item.eventName.split(" - ")[0];
            item.awayParticipantName = item.eventName.split(" - ")[1];
            item.eventId = getUrlParameter("eventId", $(this).attr("e:url"));
            list.push(item);
        });
        if ($("#sports_pagination a[text='Ileri']")) {
            $("#sports_pagination a[text='Ileri']").click();
            setTimeout(rivaloCore.grab(list), 5000);
        }
    },
    grabEvents: function () {
        var eventList = rivaloCore.getEventJson();
        rivaloCore.grab(eventList);
        rivaloCore.setEventJson(eventList);
    },
    getTimePeriods: function () {
        var timePeriodArray = [];
        $(".nav_slider_txt>div").each(function (index) {
            var item = {};
            item.value = $(this).data("index");
            item.text = $(this).text();
            timePeriodArray.push(item);
        });
        return timePeriodArray;
    },
    initBindings: function () {
        $('body').delegate('#ddlDaysCount', 'change', function (e) {
            screenLock.lock();
            setTimeout(rivaloCore.setTimePeriod($(this).val()), 5000);
            $("#comp-leftSide ul li a[href='" + rivaloCore.rivaloFootballUrl + "']").parent().find("img").first().click();
            screenLock.unLock();
        });
        $('body').delegate('#rivaloGoToEventsPage', 'click', function (e) {
            window.location = rivaloCore.rivaloFootballUrl;
        });
        $('body').delegate('#rivaloGrab', 'click', function (e) {
            rivaloCore.grabEvents();
            return false;
        });
    },
    setTimePeriod: function (index) {
        RefreshHandler.nav('/sports/selection/setTimePeriod?periodIndex=' + index);
        setTimePeriod(index, '/sports/selection/setTimePeriod', 'false');
    },
    initNavigation: function () {
        var li = $('<li/>', {
            id: 'rivaloMenuLi',
            class: 'first'
        }).appendTo('#head_nav');
        $('<a/>', {
            id: 'rivaloMenuA',
            class: 'nss-reg  virtualSportsTab',
            text: "Maçları Al",
            href: rivaloCore.rivaloFootballUrl
        }).appendTo(li);
    },
    initToolBox: function () {
        var optionsStr = "";
        var timePeriods = rivaloCore.getTimePeriods();
        for (var i = 0; i < timePeriods.length; i++) {
            var parData = timePeriods[i];
            optionsStr += '<option ' + (i == 0 ? 'selected="selected" ' : '') + 'value="' + parData.value + '">' + parData.text + '</option>';
        }
        var navContainerHtml = [];
        navContainerHtml.push(
            '<div class="navContainer" style="margin:10px 0 0px 12px; padding:10px; width:100%; background-color:white;">'
            , '<div style="float: left;">'
            , '<select name="ddlDaysCount" id="ddlDaysCount">'
            , optionsStr
            , '</select>'
            , 'İddaa<input type="checkbox" id="chkIddaa"/>'
            , '</div>'
            , '<div class="nav-search nav-search-right" id="nav-search">'
            , '<div class="form-search">'
            , '<span class="input-icon">'
            , '<input type="text" placeholder="Ara ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />'
            , '</span>'
            , '</div>'
            , '</div>'
            // , '<div style="float: right;">'
            // , '<input type="button" id="rivaloGoToEventsPage" value="Maçları Al" style="height: 24px; margin-right: 5px;" />'
            // , '</div>'
            , '<div style="float: right;">'
            , '<input type="button" id="rivaloGrab" value="Kazı" style="height: 24px; margin-right: 5px;" />'
            , '</div>'
            , '</div>'
        );
        $(".container").first().prepend(navContainerHtml.join(""));
    },
    initResources: function () {
        var div = $("<div />", {
            html: '&shy;<style>' + rivaloCore.getStyleString() + '</style>'
        }).prepend("body");

        var link2 = window.document.createElement('link');
        link2.rel = 'stylesheet';
        link2.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,300';
        document.getElementsByTagName("HEAD")[0].appendChild(link2);

        var link3 = window.document.createElement('link');
        link3.rel = 'stylesheet';
        link3.type = 'text/css';
        link3.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link3);

        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.datatables.net/1.10.18/css/jquery.dataTables.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    },
    getStyleString: function () {
        var styleHtml = [];
        styleHtml.push(
            "body {"
            , "background-color: #E4E6E9;"
            , "padding-bottom: 0;"
            , "font-family: 'Open Sans';"
            , "font-size: 13px;"
            , "color: #393939;"
            , "line-height: 1;"
            , "}"
            , ""
            , ".dataContainer {"
            , "width: 900px;"
            , "margin: 0 auto;"
            , "}"
            , ""
            , "ul.navCus {"
            , "margin: 0 0 0 20px;"
            , "padding: 0;"
            , "height: 20px;"
            , "float: left;"
            , "margin-top:10px;"
            , "}"
            , ""
            , "ul.navCus li:first-of-type {"
            , "border-top-left-radius: 6px;"
            , "border-bottom-left-radius: 6px;"
            , "}"
            , ""
            , "ul.navCus li:last-of-type {"
            , "border-top-right-radius: 6px;"
            , "border-bottom-right-radius: 6px;"
            , "border-width: 1px 1px 1px 1px;"
            , "}"
            , ""
            , "ul.navCus li {"
            , "background-color: lightblue;"
            , "padding: 4px 8px;"
            , "display: inline;"
            , "/*font-family: 'Titillium Web', sans-serif;*/"
            , "font-size: 13px;"
            , "border: solid cadetblue;"
            , "border-width: 1px 0px 1px 1px;"
            , "font-weight: bold;"
            , "}"
            , ""
            , ""
            , ".navContainer {"
            , "position: relative;"
            , ""
            , "}"
            , ""
            , ".tableContainer {"
            , "box-shadow: 0px 15px 30px 2px rgb(62, 62, 62);"
            , "background-color: transparent;"
            , "border: none;"
            , "width: 100%;"
            , "float: left;"
            , "margin: 10px 0 20px 0;"
            , "}"
            , ""
            , "#res-table {"
            , "border-top-left-radius: 6px;"
            , "border-top-right-radius: 6px;"
            , "overflow: hidden;"
            , "background-color: transparent;"
            , "}"
            , ""
            , ""
            , ".content {"
            , "margin: 20px 0 0 0;"
            , "}"
            , ""
            , ".eventDetailTable tbody td {"
            , "padding: 0 0 0 0 !important;"
            , "border: none !important;"
            , "}"
            , ""
            , ".eventDetailTable tbody tr {"
            , "background-color: transparent !important;"
            , "}"
            , ""
            , ".eventDetailTable thead tr {"
            , "font-size: 11px !important;"
            , "}"
            , ""
            , ".custom-table tbody tr {"
            , "font-size: 11px !important;"
            , "}"
            , ""
            , ".custom-table thead tr {"
            , "font-size: 12px !important;"
            , "}"
            , ""
            , ""
            , ".nav-search-right {"
            , "float: right;"
            , "}"
            , ""
            , ".nav-search .nav-search-input {"
            , "border: 1px solid #6FB3E0;"
            , "width: 152px;"
            , "height: 24px !important;"
            , "padding-top: 2px;"
            , "padding-bottom: 2px;"
            , "border-radius: 4px !important;"
            , "font-size: 13px;"
            , "line-height: 1.3;"
            , "color: #666!important;"
            , "z-index: 11;"
            , "-webkit-transition: width ease .15s;"
            , "-o-transition: width ease .15s;"
            , "transition: width ease .15s;"
            , "}"
            , ""
            , ".input-icon > input {"
            , "padding-left: 10px;"
            , "padding-right: 6px;"
            , "}"
            , ""
            , ".input-icon > .ace-icon {"
            , "padding: 0 3px;"
            , "z-index: 2;"
            , "position: absolute;"
            , "top: 1px;"
            , "bottom: 1px;"
            , "left: 3px;"
            , "line-height: 30px;"
            , "display: inline-block;"
            , "color: #909090;"
            , "font-size: 16px;"
            , "}"
            , ""
            , ".nav-search .nav-search-icon {"
            , "color: #6FB3E0!important;"
            , "font-size: 14px!important;"
            , "line-height: 24px!important;"
            , "background-color: transparent;"
            , "}"
            , ""
            , ".fa {"
            , "display: inline-block;"
            , "font: normal normal normal 14px/1 FontAwesome;"
            , "font-size: inherit;"
            , "text-rendering: auto;"
            , "-webkit-font-smoothing: antialiased;"
            , "-moz-osx-font-smoothing: grayscale;"
            , "}"
            , ""
            , ".fa-search {"
            , 'content: "\f002";'
            , "}"
            , ""
            , ".event-elapsed {"
            , "font-weight:bold;"
            , "}"
            , ""
            , ".red {"
            , "color:red;"
            , "}"
            , ""
            , "tr.group, tr.group:hover {"
            , "    background-color: #ddd !important;"
            , "}"
        );
        return styleHtml.join("");
    },
    sleep: async function (secs) {
        await rivaloCore.sleep_deep(secs * 1000);
    },
    sleep_deep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

var screenLock = {
    element: '.screenLock',
    appendHtml: function () {
        var witdh = $(screenLock.element).width();
        var marginLeft = Math.floor(witdh / 2);
        $('body').append('<div class="screenLock" style="z-index:99999;position:fixed;width:100%;height:100%;top:0px;left:0px;background-color:rgba(255, 255, 255, 0.8) !important;margin-left:-' + marginLeft + '"><div id="loading"><img src="https://zippy.gfycat.com/SkinnySeveralAsianlion.gif" id="lockLoadig" alt="" style=" position: absolute;width: 32px;left: 50%;margin-left: -16px;top: 50%;margin-top: -16px;"/></div></div> ');
    },
    deAppendHtml: function () {
        $(screenLock.element).remove();
    },
    show: function () {
        $(screenLock.element).fadeIn(200);
    },
    hide: function () {
        $(screenLock.element).fadeOut(100);
    },
    lock: function () {
        screenLock.appendHtml(screenLock.element);
        screenLock.show();
    },
    unLock: function () {
        screenLock.deAppendHtml(screenLock.element);
    }
};

function getUrlParameter(name, url) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};