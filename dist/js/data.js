$(document).ready(function() {
  var list = $('#list').DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": false,
    "responsive": true,
    "autoWidth": false,
    "scrollX": true,
    "pageLength": 10,
    "ajax": {
      "url": "https://bm.dvbrazil.com.br/list.php",
      "type": "GET",
      "dataSrc": "",
    },
    "columns": [{
        "data": "number"
      },
      {
        "data": "name"
      },
      {
        "data": "type"
      },
      {
        "data": "hardware",
        render: function(data, type, row) {
          return getRepeaterModel(data);
        }
      },
      {
        "data": "firmware"
      },
      {
        "data": "frequency1",
        render: function(data, type, row) {
          return getFrequency(data);
        }
      },
      {
        "data": "frequency2",
        render: function(data, type, row) {
          return getFrequency(data);
        }
      },
      {
        "data": "color"
      },
      {
        "data": "link",
        render: function(data, type, row) {
          return getLinkDescription(data);
        }
      },
    ]
  });
  var subscription = $('#subscription').DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": false,
    "responsive": true,
    "autoWidth": false,
    "scrollX": true,
    "pageLength": 10,
    "ajax": {
      "url": "https://bm.dvbrazil.com.br/subscription.php",
      "type": "GET",
      "dataSrc": "",
    },
    "columns": [{
        "data": "name"
      },
      {
        "data": "flavor",
        render: function(data, type, row) {
          return getCallType(data);
        }
      },
      {
        "data": "destination"
      },
      {
        "data": "caption"
      },
      {
        "data": "number"
      },
      {
        "data": "type",
        render: function(data, type, row) {
          var types = ['Application', 'Repeater', 'Network'];
          return types[data];
        }
      },
    ]
  });
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
      [0, "desc"]
    ],
    "ajax": {
      "url": "https://bm.dvbrazil.com.br/heard.php",
      "type": "GET",
      "dataSrc": function(json) {
        json = json.filter(filterData);
        $.each(json, handleData);
        return json;
      },
    },
    "columns": [{
        "data": 2
      },
      {
        "data": 4
      },
      {
        "data": 6,
        render: function(data, type, row) {
					// Renderiza tipos de links
					if ((data >= 724000) && (data <= 724900)) {
						return '<td><div class="btn btn-success btn-sm">' + data + '</div></td>';
					}
					if (((data >= 7240000) && (data <= 7249999)) || ((data >= 724000000) && (data <= 724999999)) ) {
						return '<td><div class="btn btn-primary btn-sm">' + data + '</div></td>';
					}
					if (((data >= 724900) && (data <= 724999)) || (data <= 10)) {
						return '<td><div class="btn btn-danger btn-sm">' + data + '</div></td>';
					}
					return '<td><div class="btn btn-warning btn-sm">' + data + '</div></td>';
        }
      },
      {
        "data": 7
      },
      {
        "data": 8,
        "defaultContent": "N/A"
      },
      {
        "data": 9,
				render: function(data, type, row) {
					if ((data >= 724900) && (data <= 724999)) {
						return '<td><div class="btn btn-warning btn-sm">' + data + '</div></td>';
					}
					if ((data >= 7240000) && (data <= 7249999)) {
						return '<td><div class="btn btn-success btn-sm">' + data + '</div></td>';
					}
					if (data.indexOf("722") == 0) {
						return '<td><div class="btn btn-info btn-sm">' + data + '</div></td>';
					}
          return '<td><div class="btn btn-danger btn-sm">' + data + '</div></td>';
        }
      },
      {
        "data": 10,
        render: function(data, type, row) {
					// Renderiza destinos
					if ((data >= 1) && (data <= 8)) {
						return '<td><div class="btn btn-primary btn-sm">' + data + '</div></td>';
					}
                    if (((data >= 7240) && (data <= 7249)) || ((data >= 72400) && (data <= 72499)) || (data == 724)) {
						return '<td><div class="btn btn-success btn-sm">' + data + '</div></td>';
					}
					if ((data >= 724900) && (data <= 724979)) {
						return '<td><div class="btn btn-warning btn-sm">' + data + '</div></td>';
					}
					if ((data >= 724980) && (data <= 724999)) {
						return '<td><div class="btn btn-primary btn-sm">' + data + '</div></td>';
					}
					if ((data >= 7240000) && (data <= 7249999)) {
						return '<td><div class="btn btn-primary btn-sm">' + data + '</div></td>';
					}
					if (data.indexOf("722") == 0) {
						return '<td><div class="btn btn-info btn-sm">' + data + '</div></td>';
					}
					return '<td><div class="btn btn-danger btn-sm">' + data + '</div></td>';
        }
      },
      {
        "data": 13,
        render: function(data, type, row) {
          return ((data != 'In Progress') ? ((data == 'Lost') ? ('<td><div class="btn btn-danger btn-sm">' + data + '</div></td>') : ('<td><div class="btn btn-success btn-sm">' + data + '</div></td>')) : ('<td><div class="btn btn-warning btn-sm">' + data + '</div></td>'));
        }
      },
      {
        "data": 14
      },
      {
        "data": 15
      },
      {
        "data": 17
      },
      {
        "data": 20,
        render: function(data, type, row) {
          return ((formatString(data).substring(0, 3) != 'XRF') ? ((formatString(data) == '' ? '<td>' + formatString(data) + '</td>' : '<td><div class="btn btn-success btn-sm">' + formatString(data) + '</div></td>')) : ('<td><div class="btn btn-primary btn-sm">' + formatString(data) + '</div></td>'));
        }
      },
      {
        "data": 21
      },
      {
        "data": 22
      },
      // {
      //   "data": 23
      // },
      // {
      //   "data": 24,
      //   render: function(data, type, row) {
      //     return (row[10] == '724942' || row[10] == '724945') ? ('<td><div class="btn btn-primary btn-sm">' + ' XLX724 ' + '</div></td>') : ('<td>ss' + formatString(data) + '</td>');
      //   }
      // },
      {
        "data": 25
      },


    ]
  });
  setInterval( function () {
    list.ajax.reload( null, false );
    subscription.ajax.reload( null, false );
    lastheard.ajax.reload( null, false );
}, 5000 );
});
