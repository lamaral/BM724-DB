var service = 'https://bm.dvbrazil.com.br/status/link.php?callback=?';

function handleResponseData(data)
{
  if ($.isArray(data))
  {
    var value = new String();
    for (var index = 0; index < data.length; index ++)
    {
      var number = data[index]['number'];
      value += '<option value="' + number + '">' + number + '</option>';
    }
    $('#number').html(value);
    return;
  }
  if (!$.isEmptyObject(data))
  {
    if ($('#number').is(':empty'))
    {
      var number = data['number'];
      $('#number').html('<option value="' + number + '">' + number + '</option>');
    }
    $('#group').val(data['group']);
    return;
  }
};

function select()
{
  var parameters =
  {
    number: $('#number').val()
  };
  $.getJSON(service, parameters, handleResponseData);
}

function link()
{
  var parameters =
  {
    number: $('#number').val(),
    group: $('#group').val()
  };
  $.getJSON(service, parameters, handleResponseData);
};

$.getJSON(service, handleResponseData);
