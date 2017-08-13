$(document).ready(function () {
    $('#list').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": false,
        "responsive": true,
        "autoWidth": false,
        "pageLength": 10,
        "ajax": {
            "url": "http://bm.dvbrazil.com.br/bm724/list.php",
            "type": "GET",
            "dataSrc": "",
        },
        "columns": [
            {"data": "number"},
            {"data": "name"},
            {"data": "type"},
            {"data": "hardware", render: function (data, type, row) {
                return getRepeaterModel(data);
            }},
            {"data": "firmware"},
            {"data": "frequency1", render: function (data, type, row) {
                return getFrequency(data);
            }},
            {"data": "frequency2", render: function (data, type, row) {
                return getFrequency(data);
            }},
            {"data": "color"},
            {"data": "link", render: function (data, type, row) {
                return getLinkDescription(data);
            }},
        ]
    });
    $('#subscription').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": false,
        "responsive": true,
        "autoWidth": false,
        "pageLength": 10,
        "ajax": {
            "url": "http://bm.dvbrazil.com.br/bm724/subscription.php",
            "type": "GET",
            "dataSrc": "",
        },
        "columns": [
            {"data": "name"},
            {"data": "type", render: function (data, type, row) {
                var types = [ 'Application', 'Repeater', 'Network' ];
                return types[data];
            }},
            {"data": "number"},
            {"data": "caption"},
            {"data": "flavor", render: function (data, type, row) {
                return getCallType(data);
            }},
            {"data": "destination"},
            {"data": "tag"},
        ]
    });
    $('#lastheard').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": false,
        "responsive": true,
        "autoWidth": false,
        "pageLength": 10,
        "ajax": {
            "url": "http://bm.dvbrazil.com.br/bm724/extra/heard.php",
            "type": "GET",
            "dataSrc": function (json){
                json = json.filter(filterData);
                $.each(json, handleData);
                return json;
            },
        },
        "columns": [
            {"data": 2},
            {"data": 4},
            {"data": 6, render: function (data, type, row) {
                return (((data <= 999999) || (data == 0)) ? (((data == 0) || (data <= 724000 && data >= 724999) || data < 9999) ? ('<td><div class="btn btn-warning btn-xs">' + formatString(data) + '</div></td>') : ('<td><div class="btn btn-success btn-xs">' + formatString(data) + '</div></td>')) : ('<td><div class="btn btn-primary btn-xs">' + formatString(data) + '</div></td>'));
            }},
            {"data": 7},
            {"data": 8},
            {"data": 9},
            {"data": 10, render: function (data, type, row) {
                return (((data == 724) || (data >= 7240 && data <= 7249) || (data >= 724000 && data <= 724999) || (data >= 7240000 && data <= 7249999) || data == 915 || data == 8) ? ('<td><div class="btn btn-info btn-xs">' + formatString(data) + '</div></td>') : ((data <= 999) ? ('<td><div class="btn btn-danger btn-xs">' + formatString(data) + '</div></td>') : ('<td><div class="btn btn-warning btn-xs">' + formatString(data) + '</div></td>')));
            }},
            {"data": 13, render: function (data, type, row) {
                return ((getCallState(data) != 'In Progress') ? ((getCallState(data) == 'Lost') ? ('<td><div class="btn btn-danger btn-xs">' + getCallState(data) + '</div></td>') : ('<td>' + getCallState(data) + '</td>')) : ('<td><div class="btn btn-success btn-xs">' + getCallState(data) + '</div></td>'));
            }},
            {"data": 14},
            {"data": 15},
            {"data": 17},
            {"data": 20, render: function (data, type, row) {
                return ((formatString(data).substring(0, 3) != 'CQ0') ? ((formatString(data) == '' ? '<td>' + formatString(data) + '</td>' : '<td><div class="btn btn-primary btn-xs">' + formatString(data) + '</div></td>')) : ('<td><div class="btn btn-success btn-xs">' + formatString(data) + '</div></td>'));
            }},
            {"data": 21},
            {"data": 22},
            {"data": 23},
            {"data": 24, render: function (data, type, row) {
                return (row[10] == '724942' || row[10] == '724945') ? ('<td><div class="btn btn-primary btn-xs">' + ' XLX724 ' + '</div></td>') : ('<td>' + formatString(data) + '</td>');
            }},
            {"data": 25},


        ]
    });
});
