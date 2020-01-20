// ==UserScript==
// @name         777ScoreScript
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://777score.ph/football/about
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      //code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// ==/UserScript==


$(document).ready(function () {
    setTimeout(function () {
        Main();
    }, 3000);
});


function Main(){
    $('body').empty();
    $('head').empty();
    $("body").css("margin","0");
    $('<iframe src="" frameborder="0" scrolling="no" id="myFrame" style="display:none;" width="1" height="1"></iframe>').appendTo('body');
    $('<input type="text" id="txtUrl" style="width:50%;"/>').appendTo('body');
    $('<a href="javascript:void(0);" id="btnAdd">Ekle</a>').appendTo('body');
     var strContainerHtml = [];
        strContainerHtml.push(
            '<style>'
            , '#sortable { list-style-type: none; margin: 0; padding: 0; width: 100%; }'
            , '#sortable li { margin: 3px 3px 3px 0;  float: left;   text-align: right; background-color:darkgray;}'
            , '</style>');

    $("head").prepend(strContainerHtml.join(""));

    var strSortableContainerHtml = [];
        strSortableContainerHtml.push(
            '<ul id="sortable">'
//             , '<li class="ui-state-default">1</li>'
//             , '<li class="ui-state-default">2</li>'
//             , '<li class="ui-state-default">3</li>'
//             , '<li class="ui-state-default">4</li>'
//             , '<li class="ui-state-default">5</li>'
//             , '<li class="ui-state-default">6</li>'
//             , '<li class="ui-state-default">7</li>'
//             , '<li class="ui-state-default">8</li>'
//             , '<li class="ui-state-default">9</li>'
//             , '<li class="ui-state-default">11</li>'
//             , '<li class="ui-state-default">12</li>'
            , '</ul>');

  $("body").append(strSortableContainerHtml.join(""));

    $("#sortable").sortable();
    $("#sortable").disableSelection();
    var screenWidth = $(window).width();
    $("#sortable").css("width",screenWidth - 5);
    var actual = screenWidth - 20;
    var liW = actual / 3;
    var frameW = liW;
    var frameH = frameW / 1.8;
    var liH = frameH + 10;
    $("#btnAdd").click(function() {
               $('#myFrame').attr('src',$('#txtUrl').val());
        $('#myFrame').show();
        setTimeout(function() {
         var srcUrl = $("#myFrame").contents().find("iframe[src*='/livezone/']").attr('src');
            //debugger;
         if(srcUrl!='' && srcUrl!= undefined){
             $('<li style="width:'+liW+'px; height:'+liH+';" class="ui-state-default"><a class="closeStream" href="javascript:void(0);">Kapat</a><iframe src="'+srcUrl+'" frameborder="0" scrolling="no" width="'+frameW+'" height="'+frameH+'"></iframe></li>').appendTo('#sortable');
             refreshItems();
         }
            else
                alert('Maç yayini yok!');
         }, 5000);
    });


}

$(document).on("click", '.closeStream', function(event) {
   $(this).parent("li").remove();
});


function refreshItems(){
    var currentCount = $('#sortable li').length;
    if(currentCount == 0 || currentCount == 1)
        currentCount = 2;
//     else if(currentCount == 2)
//         currentCount = 3;
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var actualW = screenWidth - 20;
    var actualH = screenHeight - 50;
    var maxColmn = Math.ceil(currentCount / 2);
    if(currentCount <= 4 )
        maxColmn = maxColmn +1;
    if(currentCount>8 && currentCount <=12)
        maxColmn = 4;
    var liW = actualW / maxColmn;
    var frameW = liW;
    var frameH = frameW / 1.8;
    var liH = frameH + 10;

    $( "#sortable li" ).each(function( index ) {
        $(this).css("width",liW);
        $(this).css("height",liH);
        var iframe =  $(this).find("iframe");
        $(iframe).attr("width",frameW);
        $(iframe).attr("height",frameH);
        $(iframe).attr("src",$(iframe).attr("src"));
    });
}
