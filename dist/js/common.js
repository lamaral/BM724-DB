function formatInterval(value) {
  var sec_num = parseInt(value, 10)
  var hours = Math.floor(sec_num / 3600) % 24
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

function formatDate(value) {
  try {
    var date = new Date(value * 1000);
    return date.format('yyyy-mm-dd HH:MM:ss');
  } catch (exception) {
    return '';
  }
}

function formatLossRate(loss, total) {
  if (loss > 0)
    return Math.floor(10000.0 * loss / total) / 100 + '% *';

  if (loss == 0)
    return '0%';

  return '';
}

function formatRSSI(value) {
	if ((value == null) ||
    (value == undefined))
    return 'N/A';
	return String(Math.round(value))+' dBm';
}

function formatString(value) {
  if ((value == null) ||
    (value == undefined))
    return '';

  return String(value);
}

function getCallState(value) {
  switch (value) {
    case 0:
    case 1:
      return 'Lost';

    case 2:
      return 'Ended';

    default:
      return 'In Progress';
  }
}

function handleData(key, value) {
  value[2] = formatDate(value[2]); // Creation Time
  value[4] = formatString(value[4]); // Link Name
  value[6] = formatString(value[6]); // Link ID
  value[7] = formatString(value[7]); // Link Slot
  value[8] = getCallType(value[8]); // Call Type
  value[9] = formatString(value[9]); // Source ID
  value[10] = formatString(value[10]); // Destination ID
  value[11] = formatString(value[11]); // Priority
  value[12] = formatString(value[12]); // Route
  value[13] = getCallState(value[13]); // State
  value[14] = formatInterval(value[14] * 0.06); // Duration
  value[15] = formatRSSI(value[15]); // RSSI
  value[16] = formatString(value[16]); // BER
  value[17] = formatLossRate(value[17], value[18]); // Loss Rate
  value[19] = formatString(value[19]); // Reflector ID
  value[20] = formatString(value[20]); // Repeater Call
  value[21] = formatString(value[21]); // Source Call
  value[22] = formatString(value[22]); // Source Name
  value[23] = formatString(value[23]); // Destination Call
  value[24] = formatString(value[24]); // Destination Name
  value[25] = formatString(value[25]); // Talker Alias
}

function filterData(value) {
  // console.log(value[13]);
  // if (formatString(value[20]) != '' && formatString(value[10]) != '724999') {
  //   return true;
  // }
  // if ((formatString(value[10]) == '724' || (value[10] >= 7240 && value[10] <= 7249) || (value[10] >= 724000 && value[10] <= 724999) || (value[10] >= 7240000 && value[10] <= 7249999)) && value[4] != 'LoopBack' && formatString(value[9]) != '724999' && formatString(value[10]) != '724999') {
  //   return true;
  // }
  if ((formatString(value[20]) != '' && formatString(value[10]) !='724999') || ( (formatString(value[10]) == '724' || (value[10] >= 7240 && value[10]<=7249) ||  (value[10] >= 724000 && value[10]<=724999) || (value[10] >= 7240000 && value[10]<=7249999)) && value[4] !='LoopBack' && formatString(value[9]) !='724999' && formatString(value[10]) !='724999'))
    return true;

  return false;
}

function getFrequency(value) {
  try {
    return value.toFixed(4).replace(/0$/g, '') + ' MHz';
  } catch (error) {
    return '-';
  }
}
