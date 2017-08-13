function formatInterval(value) {
    var sec_num = parseInt(value, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":");

//  if (value < 60)
//  {
//    value = Math.floor(value * 100) / 100;
//    return value;
//  }

//  value = Math.floor(value);
//  var minutes = Math.floor(value / 60);
//  var seconds = Math.floor(value % 60);
//  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
//  return minutes + ':' + seconds;
}

function formatDate(value) {
    try {
        var date = new Date(value * 1000);
        return date.format('yyyy-mm-dd HH:MM:ss');
    }
    catch (exception) {
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

function formatString(value) {
    if ((value == null) ||
        (value == undefined))
        return '';

    return String(value);
}

function getCallType(value) {
    switch (value) {
        case 5:
            return 'Private Voice';

        case 7:
            return 'Group Voice';

        case 9:
            return 'Private Data';

        case 11:
            return 'Group Data';

        case 17:
            return 'CSBK';

        default:
            return 'Unknown';
    }
    ;
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

function getStateDescription(state)
{
    var message = '-';
    if ((state & 0x03) != 0)
        message = 'Busy';
    if (((state & 0x0c) != 0) &&
        ((state & 0x30) == 0))
        message = 'Slot 1 Busy';
    if (((state & 0x0c) == 0) &&
        ((state & 0x30) != 0))
        message = 'Slot 2 Busy';
    if (((state & 0x0c) != 0) &&
        ((state & 0x30) != 0))
        message = 'Slots 1 & 2 Busy';
    return message;
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
    value[15] = formatString(value[15]); // RSSI
    value[16] = formatString(value[16]); // BER
    value[17] = formatLossRate(value[17], value[18]); // Loss Rate
    value[19] = formatString(value[19]); // Reflector ID
    value[20] = formatString(value[20]); // Repeater Call
    value[21] = formatString(value[21]); // Source Call
    value[22] = formatString(value[22]); // Source Name
    value[23] = formatString(value[23]); // Destination Call
    value[24] = formatString(value[24]); // Destination Name
    value[25] = formatString(value[25]);   // Talker Alias
}

function filterData(value) {
    // console.log(value);
    if (formatString(value[20]) != '' && formatString(value[10]) != '724999') {
        return true;
    }
    if (formatString(value[10]).substring(0, 3) == '724' && value[4] != 'LoopBack' && formatString(value[9]) != '724999' && formatString(value[10]) != '724999') {
        return true;
    }
    return false;
}
