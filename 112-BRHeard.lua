require('Global')

local bit = require('bit')
local mqtt = require('mqtt')
local fiber = require('fiber')
local digest = require('digest')
local msgpack = require('msgpack')

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

local connection = mqtt.new("Registry-BRHeard", true)

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

local function publishRecord(event, array)
  local data = msgpack.encode(array)
--  local data = array
  -- Build topic and transmit message
  local topic = 'BRHeard/' .. event
  connection:publish(topic, data, mqtt.QOS_1, mqtt.NON_RETAIN)
end

local BRHeard = { }

function BRHeard.start()
  connection.auto_reconnect = true
  connection:connect({ host = 'localhost', port = 1883 })
end

function BRHeard.handleSessionEvent(network, data)
  local tuple = box.space.HeardCalls.index.Key:get({ network, data['SessionID'] })
  local array = nil

  if tuple ~= nil
  then
    array = tuple:totable()
    -- Do not send to MQTT if it's FastFoward or LoopBack
    if array[5] == 'FastForward' or array[5] == 'LoopBack' then
        return
    end
    publishRecord(data['Event'], array)
  end
end

function BRHeard.handleSpecialEvent(network, data)
  local tuple = box.space.HeardCalls.index.Key:get({ network, data['SessionID'] })
  local array = nil

  if tuple ~= nil
  then
    array = tuple:totable()
    -- Do not send to MQTT if it's FastFoward or LoopBack
    if array[5] == 'FastForward' or array[5] == 'LoopBack' then
        return
    end
    publishRecord(data['Event'], array)
  end
end

return BRHeard