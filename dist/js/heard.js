$(document).ready(function() {
    // Create WS connection
    var connection = new WebSocket('ws://127.0.0.1:8000/lh');

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
        dataTablesEntry.push(lastraw['Session']);           // Session ID
        dataTablesEntry.push(formatLHDate(lastraw));     //1
        dataTablesEntry.push(lastraw['LinkName']);         //2
        dataTablesEntry.push(lastraw['LinkID']); //3
        dataTablesEntry.push(lastraw['LinkSlot']);   //4
        dataTablesEntry.push(lastraw['CallType']);    //5
        dataTablesEntry.push(lastraw['SourceID']);     //6
        dataTablesEntry.push(lastraw['DestinationID']);    //7
        dataTablesEntry.push(lastraw['State']);//8
        dataTablesEntry.push("-");  //9
        dataTablesEntry.push("-"); //10
        dataTablesEntry.push(lastraw['LossCount']); //11
        dataTablesEntry.push(lastraw['RepeaterCall']); //12
        dataTablesEntry.push(lastraw['SourceCall']); //13
        dataTablesEntry.push(lastraw['SourceName']); //14
        dataTablesEntry.push(lastraw['TalkerAlias'] || ""); //15
        
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
        "pageLength": 10,
        "order": [
          [1, "desc"]
        ],
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

function filterData(value) {
  if ((formatString(value['SourceCall']) != '' && formatString(value['DestinationID']) !='724999') || ( (formatString(value['DestinationID']) == '724' || (value['DestinationID'] >= 7240 && value['DestinationID']<=7249) ||  (value['DestinationID'] >= 724000 && value['DestinationID']<=724999) || (value['DestinationID'] >= 7240000 && value['DestinationID']<=7249999)) && value['LinkName'] !='LoopBack' && formatString(value['SourceID']) !='724999' && formatString(value['DestinationID']) !='724999'))
    return true;

  return false;
}