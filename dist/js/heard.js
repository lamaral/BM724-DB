$(document).ready(function() {
    // Create WS connection
    var connection = new WebSocket('wss://web.luiz.eng.br/lh/');

    // Log errors on the WS
    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    // Deal with messages coming from the server
    connection.onmessage = function (msg) {
        var lastraw = JSON.parse(msg.data);
//        console.log(lastraw);

        if (!filterData(lastraw)) {
            return;
        }
        
        var dataTablesEntry = [];
        dataTablesEntry.push(lastraw['Session']);               // Session ID
        dataTablesEntry.push(formatLHDate(lastraw));            // Timestamp
        dataTablesEntry.push(lastraw['LinkName']);              // Repeater Type
        dataTablesEntry.push(formatLHLinkID(lastraw));          // Repeater ID
        dataTablesEntry.push(formatLHRepeaterCall(lastraw));    // Repeater Callsign
        dataTablesEntry.push(lastraw['LinkSlot']);              // Slot
        dataTablesEntry.push(formatLHCallType(lastraw));        // Call Type
        dataTablesEntry.push(formatLHSourceID(lastraw));        // Source ID
        dataTablesEntry.push(formatLHDestinationID(lastraw));   // Destination ID
        dataTablesEntry.push(formatLHCallState(lastraw));       // Call State
        dataTablesEntry.push(formatLHDuration(lastraw));        // Duration
        dataTablesEntry.push(formatLHLossRate(lastraw));        // Loss Rate
        dataTablesEntry.push(lastraw['SourceCall']);            // Source Callsign
        dataTablesEntry.push(lastraw['SourceName']);            // Source Name
        dataTablesEntry.push(lastraw['DestinationName'] || "");     // Destination Name
        
//        console.log(dataTablesEntry)
        
        //Init datatable API
        var lhTable = $('#lastheard').DataTable();
        
        var oldTableData = lhTable.row('#' + lastraw['Session']);
        
        if (oldTableData.data()) {
            oldTableData.data(dataTablesEntry);
        } else {
            if (lastraw['Event'] == "Session-Start") {
                lhTable.row.add(dataTablesEntry).draw();
            }
        }
        lhTable.columns.adjust().draw();
    };
    
    var lastheard = $('#lastheard').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": false,
        "responsive": true,
        "autoWidth": false,
        "scrollX": true,
        "pageLength": 15,
        "order": [
          [1, "desc"]
        ],
        "lengthMenu": [ [15, 25, 50, -1], [15, 25, 50, "All"] ],
        "createdRow": function (row, data, index) {
            if (data[0]) {
                row.id = data[0];
            }
        },
    });
    lastheard.column(0).visible(false);
});

function formatLHDate(lastraw) {
    var timestamp = lastraw['CreationTime'];
    var date = new Date(timestamp * 1000);
    var datetime = date.format('yyyy-mm-dd HH:MM:ss');
    return datetime;
}

function formatLHCallType(lastraw) {
    var data = lastraw['CallType'];
    var types = 
    {
        5:  'Private Voice',
        7:  'Group Voice',
        9:  'Private Data',
        11: 'Group Data',
        17: 'CSBK'
    };
    return types[data];
}

function formatLHCallState(lastraw) {
    switch (lastraw['State']) {
        case 0:
        case 1:
            return '<td><div class="btn btn-danger btn-xs">Lost</div></td>';
        case 2:
            return '<td><div class="btn btn-success btn-xs">Ended</div></td>';
        default:
            return '<td><div class="btn btn-warning btn-xs">In Progress</div></td>';
    }
}

function formatLHLinkID(lastraw) {
    var data = lastraw['LinkID'];
    if ((data >= 724000) && (data <= 724900)) {
        return '<td><div class="btn btn-success btn-xs">' + data + '</div></td>';
    }
    if (((data >= 7240000) && (data <= 7249999)) || ((data >= 724000000) && (data <= 724999999)) ) {
        return '<td><div class="btn btn-primary btn-xs">' + data + '</div></td>';
    }
    if (((data >= 724900) && (data <= 724999)) || (data <= 10)) {
        return '<td><div class="btn btn-danger btn-xs">' + data + '</div></td>';
    }
    return '<td><div class="btn btn-warning btn-xs">' + data + '</div></td>';
}

function formatLHSourceID(lastraw) {
    var data = formatString(lastraw['SourceID']);
    if ((data >= 724900) && (data <= 724999)) {
        return '<td><div class="btn btn-warning btn-xs">' + data + '</div></td>';
    }
    if ((data >= 7240000) && (data <= 7249999)) {
        return '<td><div class="btn btn-success btn-xs">' + data + '</div></td>';
    }
    if (data.indexOf("722") == 0) {
        return '<td><div class="btn btn-info btn-xs">' + data + '</div></td>';
    }
    return '<td><div class="btn btn-danger btn-xs">' + data + '</div></td>';
}

function formatLHDestinationID(lastraw) {
    // Renderiza destinos
    var data = formatString(lastraw['DestinationID']);
    if ((data >= 1) && (data <= 8)) {
        return '<td><div class="btn btn-primary btn-xs">' + data + '</div></td>';
    }
    if (((data >= 7240) && (data <= 7249)) || ((data >= 72400) && (data <= 72499)) || (data == 724)) {
        return '<td><div class="btn btn-success btn-xs">' + data + '</div></td>';
    }
    if ((data >= 724900) && (data <= 724979)) {
        return '<td><div class="btn btn-warning btn-xs">' + data + '</div></td>';
    }
    if ((data >= 724980) && (data <= 724999)) {
        return '<td><div class="btn btn-primary btn-xs">' + data + '</div></td>';
    }
    if ((data >= 7240000) && (data <= 7249999)) {
        return '<td><div class="btn btn-primary btn-xs">' + data + '</div></td>';
    }
    if (data.indexOf("722") == 0) {
        return '<td><div class="btn btn-info btn-xs">' + data + '</div></td>';
    }
    return '<td><div class="btn btn-danger btn-xs">' + data + '</div></td>';
}

function formatLHRepeaterCall(lastraw) {
    var data = lastraw['RepeaterCall'];
    return (((formatString(data).substring(0, 3) != 'XRF') && (formatString(data).substring(0, 3) != 'XLX')) ? ((formatString(data) == '' ? '<td>' + formatString(data) + '</td>' : '<td><div class="btn btn-success btn-xs">' + formatString(data) + '</div></td>')) : ('<td><div class="btn btn-primary btn-xs">' + formatString(data) + '</div></td>'));
}

function formatLHDuration(lastraw) {
    var time = Math.floor(lastraw['UpdateTime']) - lastraw['CreationTime'];
    var sec_num = parseInt(time, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
}

function formatLHLossRate(lastraw) {
    var loss = lastraw['LossCount'];
    var total = lastraw['TotalCount'];
    
    if (loss > 0)
        return Math.floor(10000.0 * loss / total) / 100 + '% *';

    if (loss == 0)
        return '0%';

    return '';
}

function formatString(value) {
  if ((value == null) ||
    (value == undefined))
    return '';

  return String(value);
}

function formatInterval(value) {
   
}

function filterData(value) {
  if (
        (
            (formatString(value['DestinationID']) == '724') || 
            (value['DestinationID'] >= 7240 && value['DestinationID']<=7249) ||  
            (value['DestinationID'] >= 72400 && value['DestinationID']<=72499) || 
            (value['DestinationID'] >= 724000 && value['DestinationID']<=724999) || 
            (value['DestinationID'] >= 7240000 && value['DestinationID']<=7249999)
        ) && 
        value['LinkName'] !='LoopBack' && 
        formatString(value['SourceID']) !='724999' && 
        formatString(value['DestinationID']) !='724999')
    return true;

  return false;
}

