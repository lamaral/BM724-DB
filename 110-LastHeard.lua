require('Global')

local bit = require('bit')
local mqtt = require('mqtt')
local fiber = require('fiber')
local digest = require('digest')
local msgpack = require('msgpack')
local expirationd = require('expirationd')

--[[

  Last Heard


  Space Repeaters:
    1 - Repeater ID
    2 - Call / Name

  Space HeardCalls:
    1 - Network ID
    2 - Session Banner
    3 - Creation Time
    4 - Update Time
    5 - Link Name
    6 - Link Kind
    7 - Link ID
    8 - Link Slot
    9 - Call Type
    10 - Source ID
    11 - Destination ID
    12 - Priority
    13 - Route
    14 - State
    15 - Data Count
    16 - Signal Strength
    17 - Error Ratio
    18 - Loss Count
    19 - Total Count
    20 - Reflector ID
    21 - Repeater Call
    22 - Source Call
    23 - Source Name
    24 - Destination Call
    25 - Destination Name
    26 - Talker Alias

    Link Name/Call Type

]]--

local connection = mqtt.new("Registry-LastHeard", true)

local function getPrivateCallAndName(number)
  if box.space.GlobalLicensees ~= nil then
    -- Resolve call-sign and licensee name using ReplicaStore
    local tuple1 = box.space.GlobalProfiles.index.ID:get(number)
    if tuple1 ~= nil then
      local tuple2 = box.space.GlobalLicensees.index.Call:get(tuple1[8])
      if tuple2 ~= nil and tuple2[3] == 1 then
        return tuple1[8], tuple2[2]
      else
        return tuple1[8]
      end
    end
  else
    -- Resolve call-sign only using default resolver
    local tuple = getStationDataForID(number)
    if tuple ~= nil then
      return tuple[7]
    end
  end
end

local function getGroupName(number)
  if box.space.GlobalGroups ~= nil then
    -- Resolve group name using ReplicaStore
    local tuple = box.space.GlobalGroups.index.ID:get(number)
    if tuple ~= nil then
      return tuple[2]
    end
  end
end

local function getReflectorName(number)
  if box.space.GlobalReflectors ~= nil then
    -- Resolve reflector name using ReplicaStore
    local tuple = box.space.GlobalReflectors.index.ID:get(number)
    if tuple ~= nil then
      return tuple[3]
    end
  end
end

local function publishRecord(class, tuple)
  local metric = 0
  local array = tuple:totable()
  local data = msgpack.encode(array)
  -- Calculate metric for Link Name
  if type(array[5]) == 'string' then
    metric = digest.crc32(array[5])
  end
  -- Build topic and transmit message
  local topic = 'Registry/LastHeard/' ..
    class                      .. '/' ..
    array[1]                   .. '/' ..  -- Network ID
    metric                     .. '/' ..  -- Link Name
    tostring(array[7])         .. '/' ..  -- Link ID
    tostring(array[9])                    -- Call Type
  connection:publish(topic, data, mqtt.QOS_1, mqtt.NON_RETAIN)
end

local function isRecordExpired(arguments, tuple)
  local threshold = fiber.time() - 1200
  if tuple[3] <= threshold then
    publishRecord('Final', tuple)
    return true
  end
  return false
end

local function isRecordPostponed(arguments, tuple)
  local threshold = fiber.time() - 1.5
  if tuple[4] <= threshold then
    publishRecord('Intermediate', tuple)
    return true
  end
  return false
end

local LastHeard = { }

function LastHeard.start()
  box.schema.space.create('HeardCalls',     { id = 822, if_not_exists = true })
  box.space.HeardCalls:create_index('Key',  { if_not_exists = true, unique = true,  parts = { 1, 'unsigned', 2, 'string' }})
  box.space.HeardCalls:create_index('Time', { if_not_exists = true, unique = false, parts = { 3, 'unsigned' }})

  box.schema.space.create('PostponedCalls',    { id = 823, if_not_exists = true })
  box.space.PostponedCalls:create_index('Key', { if_not_exists = true, unique = true, parts = { 1, 'unsigned', 2, 'string' }})

  expirationd.start(
    'ClearHeardCalls', box.space.HeardCalls.id, isRecordExpired,
    { tuple_per_item = 50, full_scan_time = 60 })

  expirationd.start(
    'TransmitPostponedCalls', box.space.PostponedCalls.id, isRecordPostponed,
    { tuple_per_item = 50, full_scan_time = 60 })

  connection.auto_reconnect = true
  connection:connect({ host = 'localhost', port = 1883 })
end

function LastHeard.handleSessionEvent(network, data)
  local tuple = box.space.HeardCalls.index.Key:get({ network, data['SessionID'] })
  local array = nil

  if tuple ~= nil
  then
    array = tuple:totable()
  else
    array =
    {
      network, data['SessionID'], math.floor(fiber.time()),
      msgpack.NULL, msgpack.NULL,            0,            0, msgpack.NULL,            0,            0,            0,
      msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL,
      msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL
    }
  end

  -- Fill base part of data

  if array[9] == msgpack.NULL or
     array[9] == 0
  then
    array[ 5] = data['LinkName']
    array[ 6] = tonumber(data['LinkType'])
    array[ 7] = tonumber(data['ContextID'])
    array[ 8] = tonumber(data['Slot'])
    array[ 9] = tonumber(data['SessionType'])
    array[10] = tonumber(data['SourceID'])
    array[12] = tonumber(data['Priority'])
  end

  if array[11] == msgpack.NULL or
     array[11] == 0
  then
    array[11] = tonumber(data['DestinationID'])
  end

  if array[13] == msgpack.NULL and
     data['Event'] ~= 'Session-Stop'
  then
    array[13] = data['Route']
  end

  if data['Event'] == 'Session-Stop'
  then
    array[14] = tonumber(data['State'])
    array[15] = tonumber(data['DataCount'])
  end

  if array[21] == msgpack.NULL and
     data['Caption'] ~= ''
  then
    array[21] = data['Caption']
  end

  -- Fill extended part of data

  if array[22] == msgpack.NULL and  -- Source Call
     array[23] == msgpack.NULL      -- Source Name
  then
    array[22], array[23] = getPrivateCallAndName(array[10])
  end

  if array[24] == msgpack.NULL and                     -- Destination Call
     bit.band(array[9], SESSION_TYPE_FLAG_GROUP) == 0  -- Call Type
  then
    array[24], array[25] = getPrivateCallAndName(array[11])
  end

  if array[25] == msgpack.NULL and                     -- Destination Name
     array[20] == msgpack.NULL and                     -- Reflector ID
     bit.band(array[9], SESSION_TYPE_FLAG_GROUP) ~= 0  -- Call Type
  then
    array[25] = getGroupName(array[11])
  end

  array[4] = fiber.time()

  box.space.HeardCalls:replace(array)
  box.space.PostponedCalls:replace(array)
end

function LastHeard.handleSpecialEvent(network, data)
  local tuple = box.space.HeardCalls.index.Key:get({ network, data['SessionID'] })
  local array = nil

  if tuple ~= nil
  then
    array = tuple:totable()
  else
    array =
    {
      network, data['SessionID'], math.floor(fiber.time()),
      msgpack.NULL, msgpack.NULL,            0,            0, msgpack.NULL,            0,            0,            0,
      msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL,
      msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL, msgpack.NULL
    }
  end

  if data['Event'] == 'Talker-Alias'
  then
    array[26] = data['Text']
  end

  if data['Event'] == 'Reflector-Call'
  then
    array[20] = tonumber(data['ReflectorID'])
    array[25] = getReflectorName(array[20])
  end

  if data['Event'] == 'Signal-Strength' and
     data['Ratio'] == nil
  then
    array[16] = tonumber(data['Strength'])
  end

  if data['Event'] == 'Signal-Strength' and
     data['Ratio'] ~= nil
  then
    array[16] = tonumber(data['Strength'])
    array[17] = tonumber(data['Ratio'])
  end

  if data['Event'] == 'Loss-Rate'
  then
    array[18] = tonumber(data['LossCount'])
    array[19] = tonumber(data['TotalCount'])
  end

  if data['Event'] == 'User-Event'
  then
    local value = string.match(data['Text'], 'group = (%d+)')
    if value ~= nil
    then
      array[11] = tonumber(value)
      array[25] = getGroupName(array[11])
    end
  end

  array[4] = fiber.time()

  box.space.HeardCalls:replace(array)
  box.space.PostponedCalls:replace(array)
end

return LastHeard