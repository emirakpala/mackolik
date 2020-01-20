// ==UserScript==
// @name         Bilyoner Bahis Yap
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       CodeRunner
// @match        https://www.bilyoner.com/iddaa/iddaa-bahis-yap
// @grant        none
// ==/UserScript==

$(document).ready(function () {
    setTimeout(function () {
        Main();
    }, 3000);
});

function Main() {
    //162_UO_OVER
    $("<div>", { "id": "divCustomBilyoner", "style": "position:absolute; left:10px; width:200px; top:75px; z-index:9999;" }).prependTo($("body"));
    $("<input>", { 'type': "text", "id": "txtCodes", "style": "width:70%;" }).appendTo($("#divCustomBilyoner"));
    $("<select>", { "id": "ddlOddType", "style": "width:30%;" }).appendTo($("#divCustomBilyoner"));
    $('<option>').val('_UO_OVER').text('2,5U').appendTo('#ddlOddType');
    $('<option>').val('_F15_F15-O').text('1,5U').appendTo('#ddlOddType');
    $('<option>').val('_UO_UNDER').text('2,5A').appendTo('#ddlOddType');
    $('<option>').val('_F15_F15-U').text('1,5A').appendTo('#ddlOddType');
    $('<option>').val('_F_F-1').text('MS1').appendTo('#ddlOddType');
    $('<option>').val('_F_F-X').text('MS0').appendTo('#ddlOddType');
    $('<option>').val('_F_F-2').text('MS2').appendTo('#ddlOddType');
    $("<br>", {}).appendTo($("#divCustomBilyoner"));
    $("<input>", { 'type': "button", "id": "btnCustomCreateCoupon", "value": "Oluştur", "onclick": "createCustomCoupon();" }).appendTo($("#divCustomBilyoner"));

    $('#btnCustomCreateCoupon').on('click', function () {
        var codes = $("#txtCodes").val();
        if (codes == '')
            alert("alan boş geçilemez;");
        else {
            var data = JSON.parse(codes);
            var selectedOddType = $("#ddlOddType").val();
            $.each(data, function (key, value) {
                var id = value + selectedOddType;
                $("span[data-id='" + id + "']").click();
            });
        }
    });

    $('#ddlOddType').on('change', function () {
        if ($(this).val().indexOf("F15") != -1) {
            var oddBtn = $("#filter_bet_types a[rel='F15']").first();
            if (!$(oddBtn).hasClass("selected"))
                $(oddBtn).click();
        }
    });
}

