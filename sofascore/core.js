var active_class = 'selected';
var eventsSelected = [];


var sofaScoreCustom = {
    jsonData: [],
    tournamentData: [],
    jsonUrlToday: "https://www.sofascore.com/football//2019-02-19/json",
    jsonUrlDay: "http://goapi.mackolik.com/livedata?date=",
    listTable: null,
    tournamentTree: null,
    createCountryData: function () {
        if (sofaScoreCustom.tournamentTree != null) {
            $('#tournamentList').jstree("deselect_all");
            $('#tournamentList').jstree(true).settings.core.data = sofaScoreCustom.tournamentData;
            $('#tournamentList').jstree().refresh();
        }
        else {
            sofaScoreCustom.tournamentTree = $("#tournamentList").jstree({
                plugins: ["wholerow", "checkbox", "types"],
                core: {
                    themes: {
                        responsive: !1,
                        icons: false
                    },
                    data: sofaScoreCustom.tournamentData
                }
            })

            $('#tournamentList').on("changed.jstree", function (e, data) {
                sofaScoreCustom.filterDataTable(data);
            });
        }
        // $("#tournamentList").empty();
        // $.each(sofaScoreCustom.tournamentData, function(key,value) {
        //     var html = [];
        //     html.push(
        //         '<div class="checkbox">'
        //         ,'<label>'
        //         ,'<input name="form-field-checkbox" value="'+sofaScoreCustom.tournamentData[key].tournamentID+'"  type="checkbox" class="ace" />'
        //         ,'<span class="lbl">'+ sofaScoreCustom.tournamentData[key].tournamentName + '</span>'
        //         ,'</label>'
        //         ,'</div>'
        //     );
        //     $("#tournamentList").append(html.join(""));

        // });
        // $('input[name="form-field-checkbox"]').change(function () {
        //     sofaScoreCustom.filterDataTable();
        // });
    },
    getJsonData: function (counterDay, counterExist, callback) {
        if (!counterExist)
            counterExist = 0;
        var requestUrl = "";
        if (counterExist === 0) {
            requestUrl = sofaScoreCustom.jsonUrlToday;
            sofaScoreCustom.jsonData = [];
            sofaScoreCustom.tournamentData = [];
        }
        else {
            requestUrl = sofaScoreCustom.jsonUrlDay + sofaScoreCustom.getDateString(counterExist);
        }
        $.getJSON(requestUrl, function (data) {
            $.each(data.sportItem.tournaments, function (key, tournament) {
                $.each(tournament.events, function (key, event) {
                    try {
                        var item = {};
                        var tournamentNode = tournament.tournament;
                        item.tournamentCode = tournament.category.name;
                        item.tournamentID = tournament.category.id;
                        item.sportsID = event.sport.id;
                        item.iddaaCode = 0;
                        item.eventStatusID = event.status.code;
                        // if (item.sportsID != 1 || item.tournamentCode == "DUEL" || item.tournamentID === 0)
                        //     return true;
                        // if ($("#chkIddaa").is(":checked") && (item.iddaaCode == '' || item.iddaaCode <= 0))
                        //     return true;
                        // if ($("#chkNotStarted").is(":checked") && (item.eventStatusID != 0))
                        //     return true;

                        item.tournamentName = tournament.category.name;
                        item.tournamentStageID = tournament.tournament.id;
                        item.tournamentStageName = tournament.tournament.name;
                        // item.torunamentStageSeasonID = tournament.season.id;
                        // item.torunamentStageSeasonName = tournament.season.name;
                        item.isTournament = false;
                        item.eventID = event.id;
                        item.homeTeamID = event.homeTeam.id;
                        item.homeTeamName = event.homeTeam.name;
                        item.awayTeamID = event.awayTeam.id;
                        item.awayTeamName = event.awayTeam.name;

                        item.elapsed = event.statusDescription;
                        item.homeRedCardCount = event.homeRedCards;
                        item.awayRedCardCount = event.awayRedCards;
                        item.finalHomeScore = event.homeScore.normaltime;
                        item.finalAwayScore = event.awayScore.normaltime;
                        item.startTime = event.startTime;
                        item.startDate = event.formatedStartDate;
                        item.MS1 = "";
                        item.MS0 = "";
                        item.MS2 = "";
                        item.AU_A = "";
                        item.AU_U = "";
                        item.homeScore = event.homeScore.current;
                        item.awayScore = event.awayScore.current;
                        item.homeHalfScore = event.homeScore.period1;
                        item.awayHalfScore = event.awayScore.period1;
                        item.homeFirstRoundScore = 0;
                        item.awayFirstRoundScore = 0;
                        item.mbs = 0;
                        item.formattedDate = item.startDate + " " + item.startTime;
                        item.eventNameFormatted = item.homeTeamName + " " + item.awayTeamName;
                        sofaScoreCustom.jsonData.push(item);
                    }
                    catch{
                        debugger;
                    }
                });
            });
            counterExist++;
            if (counterExist <= counterDay)
                sofaScoreCustom.getJsonData(counterDay, counterExist, callback);
            else {
                debugger;
                var groupedData = sofaScoreCustom.groupBy(sofaScoreCustom.jsonData, function (d) { return d.tournamentID });
                $.each(groupedData, function (i, item) {
                    var tournamentChildren = [];
                    var groupedChildData = sofaScoreCustom.groupBy(item, function (d) { return d.tournamentStageID });
                    $.each(groupedChildData, function (e, childItem) {
                        tournamentChildren.push({
                            text: childItem[0].tournamentStageName,
                            value: childItem[0].tournamentStageID
                        });
                    })
                    if (tournamentChildren.length > 0) {
                        tournamentChildren.sort(function (a, b) {
                            return sofaScoreCustom.compareStrings(a.text, b.text);
                        });
                    }
                    sofaScoreCustom.tournamentData.push({
                        text: tournamentChildren.length > 1 ? item[0].tournamentName : item[0].tournamentName + ' - ' + tournamentChildren[0].text,
                        children: tournamentChildren.length > 1 ? tournamentChildren : null,
                        value: tournamentChildren.length > 1 ? 0 : tournamentChildren[0].value,
                    });
                })
                sofaScoreCustom.tournamentData.sort(function (a, b) {
                    return sofaScoreCustom.compareStrings(a.text, b.text);
                });

                // for (var i = 0; i < sofaScoreCustom.jsonData.length; i++) {
                //     var parData = sofaScoreCustom.jsonData[i];
                //     var hasValue = sofaScoreCustom.tournamentData.some(item => item.tournamentID === parData.tournamentID);
                //     if(!hasValue){
                //         sofaScoreCustom.tournamentData.push({
                //             tournamentID: parData.tournamentID,
                //             tournamentName: parData.tournamentName
                //         });
                //     }
                // }

                // sofaScoreCustom.tournamentData.sort(function(a, b){
                //     return sofaScoreCustom.compareStrings(a.tournamentName, b.tournamentName);
                // });

                callback();
            }

        });
    },
    populateDataTable: function () {
        sofaScoreCustom.listTable.clear();
        sofaScoreCustom.listTable.rows.add(sofaScoreCustom.jsonData);
        sofaScoreCustom.listTable.draw();
        sofaScoreCustom.createCountryData();
    },
    filterDataTable: function (data) {
        var tournamentGroup = [];

        var i, j, r = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
            tournamentGroup.push(data.instance.get_node(data.selected[i]).original.value);
        }

        //console.log(JSON.stringify(tournamentGroup));
        var filteredData = sofaScoreCustom.jsonData.filter(function (a) {
            return tournamentGroup.indexOf(a.tournamentStageID) > -1;
        });
        //listTable.data = filteredData;
        sofaScoreCustom.listTable.clear();
        if (filteredData.length > 0)
            sofaScoreCustom.listTable.rows.add(filteredData);
        else
            sofaScoreCustom.listTable.rows.add(sofaScoreCustom.jsonData);
        sofaScoreCustom.listTable.draw();
        // var tournamentGroup = [];
        // $('input[name="form-field-checkbox"]:checked').each(function() {
        //     tournamentGroup.push(this.value);
        // });

        // //console.log(JSON.stringify(tournamentGroup));
        // var filteredData = sofaScoreCustom.jsonData.filter(function (a) {
        //     return tournamentGroup.indexOf(a.tournamentID.toString()) > -1;
        // });
        // //listTable.data = filteredData;
        // sofaScoreCustom.listTable.clear();
        // if(filteredData.length > 0)
        //     sofaScoreCustom.listTable.rows.add(filteredData);
        // else
        //     sofaScoreCustom.listTable.rows.add(sofaScoreCustom.jsonData);
        // sofaScoreCustom.listTable.draw();
    },
    initDataTable: function () {
        sofaScoreCustom.createCountryData();
        $('#ddlDaysCount').on('change', function () {
            sofaScoreCustom.getJsonData(this.value, 0, sofaScoreCustom.populateDataTable);
        });
        $('#btnCreateCoupon').on('click', function () {
            sofaScoreCustom.prepareCoupon();
        });
        $('#btnSetAllSelected').on('click', function () {
            $('#res-table tr[role="row"]').each(function () {
                var row = this;
                $(row).removeClass(active_class);
            });
            sofaScoreCustom.listTable.rows().data().each(function (data, index) {
                var au = data["AU_U"];
                var status = data["eventStatusID"];
                var minOddVal = $("#txtMinOddVal").val() != "" ? $("#txtMinOddVal").val() : 0;
                var maxOddVal = $("#txtMaxOddVal").val() != "" ? $("#txtMaxOddVal").val() : 0;
                var row = sofaScoreCustom.listTable.row(index);
                if ((minOddVal == 0 || parseFloat(au).toFixed(2) >= parseFloat(minOddVal).toFixed(2)) && (maxOddVal == 0 || parseFloat(au).toFixed(2) <= parseFloat(maxOddVal).toFixed(2)) && status == 0 && au != 0) {
                    var $row = $('#res-table tr[role="row"]').eq(index + 1);
                    //table.find('tr').eq(index)
                    if (!$row.hasClass(active_class)) {
                        $row.addClass(active_class);
                    }
                }
            });
            // $('#res-table tr').each(function () {
            //     var $table = $(this).closest('table');
            //     var $row = $(this);
            //     if ($row.is('.detail-row ') || $table.is('.eventDetailTable') || !$(this).is('.dt-center')) return;
            //     if ($row.hasClass(active_class)) {
            //         // $row.removeClass(active_class);
            //     }
            //     else {

            //         $row.addClass(active_class);
            //     }
            // });
        });
        $('#btnCreate').on('click', function () {
            sofaScoreCustom.createCoupon();
        });
        $('#btnClose').on('click', function () {
            $("#dialog-message").fadeOut(500);
            sofaScoreCustom.clearParams();
            $("#res-table").find('tbody > tr').each(function () {
                var row = this;
                $(row).removeClass(active_class);
            });
        });
        $("#chkIddaa").change(function () {
            sofaScoreCustom.getJsonData($("#ddlDaysCount").val(), 0, sofaScoreCustom.populateDataTable);
        });
        $("#chkNotStarted").change(function () {
            sofaScoreCustom.getJsonData($("#ddlDaysCount").val(), 0, sofaScoreCustom.populateDataTable);
        });
        sofaScoreCustom.listTable = $('#res-table').DataTable({
            "processing": true,
            "paginate": false,
            "responsive": true,
            //"searching" : false,
            "order": [[0, "asc"]],
            "data": sofaScoreCustom.jsonData,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(1, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="15">' + group + '</td></tr>'
                        );
                        last = group;
                    }
                });
            },
            // "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            //     if (aData["ColorCode"] != "" && isColor) {
            //         $(nRow).css('background-color','#' + aData["ColorCode"]);
            //         //$('td', nRow).css('background-color', '#' + aData["ColorCode"]);
            //     }
            // },
            "sDom": "",
            "language": {
                "search": "Ara ",
                "processing": "İşleniyor",
                "loading": "Yükleniyor"
            },
            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return row.formattedDate;
                    },
                    "type": "de_datetime",
                    "targets": ["FormattedDate"],
                    "visible": false,
                },
                {
                    "render": function (data, type, row) {
                        return row.startDate;
                    },
                    "type": "de_datetime",
                    "targets": ["StartDate"],
                    "visible": false,
                },
                {
                    "render": function (data, type, row) {
                        return row.eventNameFormatted;
                    },
                    "targets": ["EventNameHidden"],
                    "visible": false
                },
                {
                    "render": function (data, type, row) {
                        return row.elapased == null || row.elapased == "" ? "yok" : row.elapased;
                    },
                    "targets": ["ElapsedHidden"],
                    "visible": false
                },
                {
                    "render": function (data, type, row) {
                        var html = '';
                        html += '<span style="display:none;">' + row.tournamentName + '</span><span title="' + row.tournamentName + ' - ' + row.tournamentStageName + '">' + row.tournamentCode + '</span>';
                        return html;
                    },
                    "targets": ["TournamentStageCode"]
                },
                {
                    "render": function (data, type, row) {
                        return row.iddaaCode == "0" ? "-" : row.iddaaCode;
                    },
                    "targets": ["IddaaCode"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        return row.startTime;
                    },
                    "targets": ["StartTime"],
                    "className": "dt-center start-time"
                },
                {
                    "render": function (data, type, row) {
                        var html = '<span class="event-elapsed ';
                        if (row.eventStatusID == "1" || row.eventStatusID == "3") {
                            html += 'red">';
                            html += row.elapsed + "'";
                        }
                        else if (row.eventStatusID == "2") {
                            html += 'red">';
                            html += row.elapsed;
                        }
                        else if (row.eventStatusID != "0") {
                            html += '">';
                            html += row.elapsed;
                        }
                        else
                            html += '';
                        html += '</span>';
                        return html;
                    },
                    "targets": ["Elapsed"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var strEventT = '<table class="eventDetailTable" align="center" width="100%" style="padding: 0 0 0 0;">';
                        strEventT += '<tr>';
                        strEventT += '<td style="padding-right:4px !important;" align="right" width="45%">';
                        if (parseInt(row.homeRedCardCount) > 0)
                            strEventT += '<img style="margin-right:5px;" src="http://im.cdn.md/img/icons/kk-' + row.homeRedCardCount + '.gif"/>' + row.homeTeamName;
                        else
                            strEventT += row.homeTeamName;
                        strEventT += '</td>';
                        strEventT += '<td style="text-align:center; font-weight:bold; color:' + ((row.eventStatusID == 1 || row.eventStatusID == 2 || row.eventStatusID == 3) ? "red" : "black") + ';">';
                        strEventT += '<a class="detailClick" data-hn="' + row.homeTeamName + '" data-an="' + row.awayTeamName + '" data-id="' + row.eventID + '" data="' + row.eventStatusID + '" style="text-decoration:none; text-align:center; font-weight:bold; color:' + ((row.eventStatusID == 1 || row.eventStatusID == 2 || row.eventStatusID == 3) ? "red" : "black") + ';" target="_blank" href="javascript:void(0);">';
                        strEventT += row.eventStatusID === 0 ? "vs" : (row.eventStatusID == 9 || row.eventStatusID == 10 || row.eventStatusID == 11 ? row.elapsed : (row.homeScore + ' - ' + row.awayScore));
                        strEventT += '</a>';
                        strEventT += '</td>';
                        strEventT += '<td style="padding-left:4px !important;" align="left" width="45%">';
                        if (parseInt(row.awayRedCardCount) > 0)
                            strEventT += row.awayTeamName + '<img style="margin-left:5px;" src="http://im.cdn.md/img/icons/kk-' + row.awayRedCardCount + '.gif"/>';
                        else
                            strEventT += row.awayTeamName;
                        strEventT += '</td>';
                        strEventT += '</tr>';
                        strEventT += '</table>';
                        //return  + '<strong style="color: #CC0000; margin: 0 6px 0 6px">' + row["HomeScore"] + ' - ' + row["AwayScore"] + '</strong>' + row["AwayParticipantName"];
                        return strEventT;
                    },
                    "targets": ["EventName"]
                },
                {
                    "render": function (data, type, row) {
                        if (row.eventStatusID == "0" || row.eventStatusID == "1")
                            return '-';
                        else
                            return row.homeHalfScore + ' - ' + row.awayHalfScore;
                    },
                    "targets": ["HalfScore"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var value = data === null || data == 0 ? "-" : parseFloat(data).toFixed(2);
                        return value;
                    },
                    "targets": ["MS_1"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var value = data === null || data == 0 ? "-" : parseFloat(data).toFixed(2);
                        return value;
                    },
                    "targets": ["MS_0"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var value = data === null || data == 0 ? "-" : parseFloat(data).toFixed(2);
                        return value;
                    },
                    "targets": ["MS_2"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var value = data === null || data == 0 ? "-" : parseFloat(data).toFixed(2);
                        return value;
                    },
                    "targets": ["MS_2_5_A"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        var value = data === null || data == 0 ? "-" : parseFloat(data).toFixed(2);
                        return value;
                    },
                    "targets": ["MS_2_5_U"],
                    "className": "dt-center"
                },
                {
                    "render": function (data, type, row) {
                        return row.eventStatusID;
                    },
                    "targets": ["EventStatus"],
                    "visible": false,
                }
            ],
            "columns": [
                { "data": "formattedDate", "sortable": false },
                { "data": "startDate", "sortable": false },
                { "data": "eventNameFormatted", "sortable": false },
                { "data": "elapsed", "sortable": false },
                { "title": "Tur.", "sortable": true },
                { "data": "iddaaCode", "sortable": false },
                { "data": "startTime", "sortable": false },
                { "title": "Dur.", "sortable": false },
                { "title": "Maç", "sortable": false },
                { "title": "IY", "sortable": false },
                { "data": "MS1", "sortable": true },
                { "data": "MS0", "sortable": false },
                { "data": "MS2", "sortable": true },
                { "data": "AU_A", "sortable": true },
                { "data": "AU_U", "sortable": true },
                { "data": "eventStatusID", "sortable": false }
            ]
        });

        $('#nav-search-input').keyup(function () {
            sofaScoreCustom.listTable.draw();
        });

        $('#btnSetAllFiltered').on('click', function () {
            sofaScoreCustom.listTable.draw();
        });


        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
                var keyword = $('#nav-search-input').val();
                var notStartedChecked = $('#chkNotStarted').prop('checked');
                var minOddVal = $("#txtMinOddVal").val() != "" ? $("#txtMinOddVal").val() : 0;
                var maxOddVal = $("#txtMaxOddVal").val() != "" ? $("#txtMaxOddVal").val() : 0;
                var au = data[14];
                var eventName = data[2];
                var statusId = data[15];
                if (keyword != '') {
                    if (eventName.toLowerCase().indexOf(keyword.toLowerCase()) != -1)
                        return true;
                    else
                        return false;
                }
                else if ($("#txtMinOddVal").val() != "" || $("#txtMaxOddVal").val() != "") {
                    if ((minOddVal == 0 || parseFloat(au).toFixed(2) >= parseFloat(minOddVal).toFixed(2)) && (maxOddVal == 0 || parseFloat(au).toFixed(2) <= parseFloat(maxOddVal).toFixed(2)) && status == 0 && au != 0)
                        return true;
                    else
                        return false;
                }
                else
                    return true;
            }
        );

        $('#res-table tbody').on('click', 'tr > td', function () {
            var $table = $(this).closest('table');
            var $row = $(this).closest('tr');
            if ($row.is('.detail-row ') || $table.is('.eventDetailTable') || !$(this).is('.dt-center')) return;
            if ($row.hasClass(active_class)) {
                $row.removeClass(active_class);
            }
            else {

                $row.addClass(active_class);
            }
        });

        // $('.detailClick').on('click', function (e) {
        //   if(e.which == 1 || e.which == 2){
        //     var id = $(this).attr("data-id");
        //     var team1 = $(this).attr("data-hn");
        //     var team2 = $(this).attr("data-an");
        //     var url = "http://www.mackolik.com/Mac/" + id + "/" + translateChars(team1 + "-" + team2);
        //     var win2 = window.open(url,'_blank');
        //     if(e.which == 2){
        //       win2.blur();
        //       window.focus();
        //     }
        //   }
        //   e.preventDefault();
        // });


        $('body').delegate('.detailClick', 'click', function (e) {
            if (e.which == 1 || e.which == 2) {
                var id = $(this).attr("data-id");
                var team1 = $(this).attr("data-hn");
                var team2 = $(this).attr("data-an");
                var url = "http://arsiv.mackolik.com/Mac/" + id + "/" + translateChars(team1 + "-" + team2);
                var win2 = window.open(url, '_blank');
                if (e.which == 2) {
                    win2.blur();
                    window.focus();
                }
            }
            e.preventDefault();
        });
    },
    pageInit: function () {
        $("head").empty();
        $("body").empty();
        for (i = 0; (l = document.getElementsByTagName("link")[i]); i++) {
            if (l.getAttribute("rel").indexOf("style") >= 0) l.disabled = true;
        }
        for (i = 0; (l = document.getElementsByTagName("link")[i]); i++) {
            if (l.getAttribute("rel").indexOf("script") >= 0) l.disabled = true;
        }
        //$("script").each(function() {
        //$(this).empty();
        //});
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://localhost/betminer/assets/css/bootstrap.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link);

        var link3 = window.document.createElement('link');
        link3.rel = 'stylesheet';
        link3.type = 'text/css';
        link3.href = 'http://localhost/betminer/assets/css/jquery.dataTables.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link3);


        var link2 = window.document.createElement('link');
        link2.rel = 'stylesheet';
        link2.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,300';
        document.getElementsByTagName("HEAD")[0].appendChild(link2);

        var link4 = window.document.createElement('link');
        link4.rel = 'stylesheet';
        link4.href = 'http://localhost/betminer/assets/css/mackolik.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link4);

        var link5 = window.document.createElement('link');
        link5.rel = 'stylesheet';
        link5.href = 'http://localhost/betminer/assets/plugin/jstree/dist/themes/default/style.min.css';
        document.getElementsByTagName("HEAD")[0].appendChild(link5);


        var strTableHtml = [];
        strTableHtml.push(
            '<table id="res-table" class="display compact custom-table cell-border" cellspacing="0" width="100%">'
            , '<thead>'
            , '<tr>'
            , '<th width="0%" class="FormattedDate"></th>'
            , '<th width="0%" class="StartDate"></th>'
            , '<th width="0%" class="EventNameHidden"></th>'
            , '<th width="0%" class="ElapsedHidden"></th>'
            , '<th class="TournamentStageCode">Tur.</th>'
            , '<th class="IddaaCode">Kod</th>'
            , '<th class="StartTime">Saat</th>'
            , '<th class="Elapsed">Dur.</th>'
            , '<th class="EventName">Maç</th>'
            , '<th class="HalfScore">IY</th>'
            , '<th class="MS_1">1</th>'
            , '<th class="MS_0">X</th>'
            , '<th class="MS_2">2</th>'
            , '<th class="MS_2_5_A">2,5A</th>'
            , '<th class="MS_2_5_U">2,5Ü</th>'
            , '<th class="EventStatus"></th>'
            , '</tr>'
            , '</thead>'
            , '</table>'
        );

        var strContainerHtml = [];
        strContainerHtml.push(
            '<div id="countryList" style="position:absolute;left:15px;background-color:#f6f6f6;padding:10px;width:250px;overflow-x:hidden;">'
            , '<div class="nav-search" id="nav-search">'
            , '<div class="form-search">'
            , '<span class="input-icon">'
            , '<input type="text" placeholder="Ara ..." class="nav-search-input" id="search-tournament" autocomplete="off" />'
            , '</span>'
            , '</div>'
            , '</div>'
            , '<div class="control-group" id="tournamentList">'
            , '<label class="control-label bolder blue">Checkbox</label>'
            , '<div class="checkbox">'
            , '<label>'
            , '<input name="form-field-checkbox" type="checkbox" class="ace" />'
            , '<span class="lbl">choice 1</span>'
            , '</label>'
            , '</div>'
            , '<div class="checkbox">'
            , '<label>'
            , '<input name="form-field-checkbox" type="checkbox" class="ace" />'
            , '<span class="lbl">choice 2</span>'
            , '</label>'
            , '</div>'
            , '</div>'
            , '</div>'
            , '<div id="mainContainer">'
            , '<div id="header"></div>'
            , '<div id="content" class="content">'
            , '<div class="dataContainer">'
            , '<input type="hidden" id="emiro" value="10" />'
            , '<div class="navContainer">'
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
            , ' Başlamamış Maçlar<input type="checkbox" id="chkNotStarted"/>'
            , '</div>'
            , '<div class="nav-search nav-search-right" id="nav-search">'
            , '<div class="form-search">'
            , '<span class="input-icon">'
            , '<input type="text" placeholder="Ara ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />'

            , '</span>'
            , '</div>'
            , '</div>'
            , '<div style="float: right;">'
            , '<input type="text" id="txtMinOddVal" style="width: 35px;" />'
            , ' - '
            , '<input type="text" id="txtMaxOddVal" style="width: 35px;" />'
            , '<input type="button" id="btnSetAllFiltered" value="Filtrele" style="height: 24px; margin-right: 5px;" />'
            , '<input type="button" id="btnSetAllSelected" value="Tümünü Seç" style="height: 24px; margin-right: 5px;" />'
            , '<input type="button" id="btnCreateCoupon" value="Random Kupon" style="height: 24px; margin-right: 5px;" />'
            , '</div>'
            , '</div>'
            , '<div id="tableContainer" class="tableContainer"></div>'
            , '</div>'
            , '</div>'
            , '<div id="footer"></div>'
            , '</div>'

            , '<div id="dialog-message" title="Kuponlar" style="position:absolute; right:25px; width:255px; display:none;">'
            , '<table>'
            , '<tr><td>Seçilen Maç</td>'
            , '<td>'
            , '<span id="selectedEventCount"></span>'
            , '</td></tr>'
            , '<tr>'
            , '<td>Maç Sayısı</td>'
            , '<td>'
            , '<select id="ddlMatchCount">'
            , '<option value="1">1</option>'
            , '<option value="2">2</option>'
            , '<option value="3">3</option>'
            , '<option value="4">4</option>'
            , '<option value="5" selected="selected">5</option>'
            , '<option value="6">6</option>'
            , '<option value="7">7</option>'
            , '<option value="8">8</option>'
            , '<option value="9">9</option>'
            , '<option value="10">10</option>'
            , '<option value="11">11</option>'
            , '<option value="12">12</option>'
            , '<option value="13">13</option>'
            , '<option value="14">14</option>'
            , '<option value="15">15</option>'
            , '<option value="16">16</option>'
            , '<option value="17">17</option>'
            , '<option value="18">18</option>'
            , '<option value="19">19</option>'
            , '<option value="20">20</option>'
            , '<option value="21">21</option>'
            , '<option value="22">22</option>'
            , '<option value="23">23</option>'
            , '<option value="24">24</option>'
            , '<option value="25">25</option>'
            , '<option value="26">26</option>'
            , '<option value="27">27</option>'
            , '<option value="28">28</option>'
            , '<option value="29">29</option>'
            , '<option value="30">30</option> '
            , '</select>'
            , '</td>'
            , '</tr>'
            , '<tr>'
            , '<td>Kupon Sayısı</td>'
            , '<td>'
            , '<select id="ddlCouponCount">'
            , '<option value="1">1</option>'
            , '<option value="2">2</option>'
            , '<option value="3" selected="selected">3</option>'
            , '<option value="4">4</option>'
            , '<option value="5">5</option>'
            , '<option value="6">6</option>'
            , '<option value="7">7</option>'
            , '<option value="8">8</option>'
            , '<option value="9">9</option>'
            , '<option value="10">10</option>'
            , '</select></td>'
            , ' </tr>'
            , '<tr>'
            , '<td>'

            , '</td>'
            , '<td>'
            , '<input type="button" id="btnCreate" value="Oluşur" />'
            , '</td>'
            , '</tr>'
            , '</table>'
            , '<br/>'
            , '<div id="dialogContainer"></div>'
            , '<br/>'
            , '<br/>'
            , '<input type="button" id="btnClose" value="Kapat" />'
            , '</div>'
        );

        $("body").prepend(strContainerHtml.join(""));
        $("#tableContainer").html(strTableHtml.join(""));

        $(document).ajaxStart(function () {
            screenLock.lock();
        });

        $(document).ajaxStop(function () {
            screenLock.unLock();
        });


    },
    compareStrings: function (a, b) {
        // Assuming you want case-insensitive comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    },
    getDateString: function (dayCount) {
        var today = new Date(new Date().setTime(new Date().getTime() + dayCount * 86400000));
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '/' + mm + '/' + yyyy;
    },
    prepareCoupon: function () {
        sofaScoreCustom.clearParams();
        if (sofaScoreCustom.listTable.rows('.selected').data().length > 0) {
            sofaScoreCustom.listTable.rows('.selected').data().each(function (data, row) {
                var item = {};
                item.eventName = data["homeTeamName"] + " - " + data["awayTeamName"];
                item.iddaaCode = data["iddaaCode"];
                eventsSelected.push(item);
            });
            $("#selectedEventCount").html(eventsSelected.length);
            $("#dialog-message").fadeIn(500);
        } else {
            alert("Karşılaşma seçiniz.");
        }
    },
    clearParams: function () {
        eventsSelected = [];
        $("#selectedEventCount").html("");
        $("#dialogContainer").html("");
    },
    createCoupon: function () {
        var eventCount = eventsSelected.length;
        var eventPerCoupon = $("#ddlMatchCount option:selected").val();
        var couponCount = $("#ddlCouponCount option:selected").val();
        if (eventPerCoupon * couponCount > eventCount) {
            alert("seçilen maç sayısı oluşturulacak kuponlardan daha az olmamalı.");
            return;
        }

        eventsSelected = sofaScoreCustom.shuffle(eventsSelected);

        html = "";

        for (var i = 0; i < couponCount; i++) {
            var codes = [];
            for (var j = i * eventPerCoupon; j < (eventPerCoupon * (i + 1)); j++) {
                html += eventsSelected[j].eventName;
                codes.push(eventsSelected[j].iddaaCode);
                html += "</br>";
                if (j == eventPerCoupon - 1)
                    break;
            }
            html += "<input type='text' style='width:100%;' value='" + JSON.stringify(codes) + "'/>";
            html += "<br/>"
            html += "<hr/>";
        }

        $("#dialogContainer").html(html);

    },
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    groupBy: function (array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    }
};


function translateChars(name) {
    var translate_re = /['ıçşüöğİÇŞÜÖĞ']/g;
    var translate = { 'ı': "i", 'ç': "c", 'ş': "s", 'ü': "u", 'ö': "o", 'ğ': "g", 'İ': "I", 'Ç': "C", 'Ş': "S", 'Ü': "U", 'Ö': "O", 'Ğ': "G" }

    var str1 = name.replace(translate_re, function (match) {
        return translate[match];
    });
    return str1.replace(/[',.:;!"?’…“”–(*)\/+]/g, '').replace(/\s/g, '-');
}






var screenLock = {
    element: '.screenLock',
    appendHtml: function () {
        var witdh = $(screenLock.element).width();
        var marginLeft = Math.floor(witdh / 2);
        $('body').append('<div class="screenLock" style="position:fixed;width:100%;height:100%;top:0px;left:0px;background-color:rgba(255, 255, 255, 0.8) !important;margin-left:-' + marginLeft + '"><div id="loading"><img src="http://localhost/betminer/assets/img/loading.gif" id="lockLoadig" alt="" style=" position: absolute;width: 32px;left: 50%;margin-left: -16px;top: 50%;margin-top: -16px;"/></div></div> ');
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


// function addStyleSheet(url) {
//     var link = document.createElement("link");
//     link.href = url;
//     link.rel="stylesheet";
//     link.type="text/css";
//     return link;
// }

// var hideElements = [
//     "top-bar",
//     "header",
//     "menu",
//     "dvTopBanner2-sticky-wrapper",
//     "bannerContainer2"
// ];

// function onStart(){
//     $(document).ready(function() {
//         beautifyHtml();
//         $("#btnFormatla" ).on( "click", function() {

//         });
//     });
// }

// function beautifyHtml(){
//     $("<input>", {'type': "button",'value': "Formatla","id": "btnFormatla","style":"cursor:pointer;"}).prependTo($("#live-top-menu"));
//     $(window).scroll(function() {
//         $("#live-top-menu").css("cssText", "top: 20px !important;");
//         $("#live-top-menu").css("cssText", "position: fixed !important;");
//     });
//     $.each(hideElements, function(index, value) {
//         $("#" + value).hide();
//     });
//     //$("#live-master").children().first().remove();
//     $("#live-top-menu").css("cssText", "top: 20px !important;");
//     //checkSport(2);
//     //changeOrder(1);
//     //getFootballGroup('all');
//     setTimeout(beautifyAfterTableLoaded, 3000);
// }

// function beautifyAfterTableLoaded(){
//     $("#bannerPlaceHolder1").closest("tr").hide();
//     $("#bannerPlaceHolder2").closest("tr").hide();
//     $("#bannerPlaceHolder3").closest("tr").hide();
//     $("#bannerContainer1").remove();
//     $("#bannerContainer2").remove();
//     $("#bannerContainer3").remove();
// }
