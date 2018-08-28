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
  setInterval( function () {
    list.ajax.reload( null, false );
    subscription.ajax.reload( null, false );
  }, 5000 );
});

function getFrequency(value) {
  try {
    return value.toFixed(4).replace(/0$/g, '') + ' MHz';
  } catch (error) {
    return '-';
  }
}

