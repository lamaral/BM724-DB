function handleData(key, value) {
  if ((formatString(value[20]) != '' && formatString(value[10]) != '268999') || ((formatString(value[10]) == '268' || (value[10] >= 2680 && value[10] <= 2689) || (value[10] >= 268000 && value[10] <= 268999) || (value[10] >= 2680000 && value[10] <= 2689999)) && value[4] != 'LoopBack' && formatString(value[9]) != '268999' && formatString(value[10]) != '268999') || formatString(value[10]) == '915')
    if ((value[10] < 268960 || value[10] > 268969) && (value[9] < 268960 || value[9] > 268969)) {
      var contents =
        '<td>' + formatDate(value[2]) + '</td>' + // Creation Time
        '<td>' + formatString(value[4]) + '</td>' + // Link Name
        (((value[6] <= 999999) || (value[6] == 0)) ? (((value[6] == 0) || (value[6] <= 268000 && value[6] >= 268999) || value[6] < 9999) ? ('<td><div class="btn btn-warning btn-xs">' + formatString(value[6]) + '</div></td>') : ('<td><div class="btn btn-success btn-xs">' + formatString(value[6]) + '</div></td>')) : ('<td><div class="btn btn-primary btn-xs">' + formatString(value[6]) + '</div></td>')) +

        '<td>' + formatString(value[7]) + '</td>' + // Link Slot
        '<td>' + getCallType(value[8]) + '</td>' + // Call Type
        '<td>' + formatString(value[9]) + '</td>' + // Source ID

        (((value[10] == 268) || (value[10] >= 2680 && value[10] <= 2689) || (value[10] >= 268000 && value[10] <= 268999) || (value[10] >= 2680000 && value[10] <= 2689999) || value[10] == 915 || value[10] == 8) ? ('<td><div class="btn btn-info btn-xs">' + formatString(value[10]) + '</div></td>') : ((value[10] <= 999) ? ('<td><div class="btn btn-danger btn-xs">' + formatString(value[10]) + '</div></td>') : ('<td><div class="btn btn-warning btn-xs">' + formatString(value[10]) + '</div></td>'))) +

        ((getCallState(value[13]) != 'In Progress') ? ((getCallState(value[13]) == 'Lost') ? ('<td><div class="btn btn-danger btn-xs">' + getCallState(value[13]) + '</div></td>') : ('<td>' + getCallState(value[13]) + '</td>')) : ('<td><div class="btn btn-success btn-xs">' + getCallState(value[13]) + '</div></td>')) +

        '<td>' + formatInterval(value[14] * 0.06) + '</td>' + // Duration

        (Math.floor(value[15]) == 0 ? '<td>' + formatString(value[15]) + '</td>' : '<td>' + formatString(Math.floor(value[15])) + '</td>') +

        '<td>' + formatLossRate(value[17], value[18]) + '</td>' + // Loss Rate
        '<td>' + formatString(value[19]) + '</td>' + // Reflector ID

        //    '<td>' + formatString(value[20]) + '</td>' +  // Repeater Call

        //((formatString(value[20]).substring(0, 3) != 'CQ0') ? ('<td><div class="btn btn-primary btn-xs">' + formatString(value[20]) + '</div></td>') : ('<td><div class="btn btn-success btn-xs">' + formatString(value[20]) + '</div></td>')) +
        ((formatString(value[20]).substring(0, 3) != 'CQ0') ? ((formatString(value[20]) == '' ? '<td>' + formatString(value[20]) + '</td>' : '<td><div class="btn btn-primary btn-xs">' + formatString(value[20]) + '</div></td>')) : ('<td><div class="btn btn-success btn-xs">' + formatString(value[20]) + '</div></td>')) +

        '<td>' + formatString(value[21]) + '</td>' + // Source Call
        '<td>' + formatString(value[22]) + '</td>' + // Source Name

        //    '<td>' + formatString(value[23]) + '</td>' +  // Destination Call
        // Arrabida / DCS
        //((value[6]==268303 && value[7]==2 && value[10]==9) ? ('<td><div class="btn btn-primary btn-xs">' + ' DCS ' + '</div></td>') : ('<td>' + formatString(value[23]) + '</td>') ) +

        ((makeDestinationCall(value[6], value[7], value[10], value[23]) != formatString(value[23])) ? ('<td><div class="btn btn-primary btn-xs">' + makeDestinationCall(value[6], value[7], value[10], value[23]) + '</div></td>') : ('<td>' + formatString(value[23]) + '</td>')) +

        '<td>' + formatString(value[24]) + '</td>' + // Destination Name
        '<td>' + formatString(value[25]) + '</td>'; // Talker Alias

      $('#store tbody').append('<tr style="font-size: small;">' + contents + '</tr>');
    }
  // }
}
