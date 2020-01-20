var rivaloCore = {
    navigationHtmlUrl: "http://www.geronimosoftware.net/betminer/rivalo/navigationPartial.html",
    layoutHtmlUrl: "http://www.geronimosoftware.net/betminer/rivalo/layout.html",
    init: function () {
        rivaloCore.initResources();
        rivaloCore.initToolBox();
    },
    initToolBox: function () {
        var navContainerHtml = [];
        navContainerHtml.push(
            '<div class="navContainer">'
            , '<div style="float: left;">'
            , '<select name="ddlDaysCount" id="ddlDaysCount">'
            , '<option selected="selected" value="0">Bugün</option>'
            , '<option value="1">+1</option>'
            , '<option value="2">+2</option>'
            , '<option value="3">+3</option>'
            , '<option value="4">+4</option>'
            , '<option value="5">+5</option>'
            , '<option value="6">+6</option>'
            , '<option value="7">+7</option>'
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
            , '<div style="float: right;">'
            , '<input type="button" id="btnCreateCoupon" value="Random Kupon" style="height: 24px; margin-right: 5px;" />'
            , '</div>'
            , '</div>'
        );
        $("body").prepend(navContainerHtml.join(""));
    },
    initResources: function () {
        var div = $("<div />", {
            html: '&shy;<style>' + rivaloCore.getStyleString() + '</style>'
        }).prepend("body");

        var link2 = window.document.createElement('link');
        link2.rel = 'stylesheet';
        link2.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,300';
        document.getElementsByTagName("HEAD")[0].appendChild(link2);
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
    }
};