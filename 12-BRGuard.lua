-- Core modules
require('Core')
require('bit')

--[[

BRGuard Plugin
By PU2ENG - Luiz
Based on work from ON3YH - Yentel (Admin BM2061)

]]--


local BRGuard = { }


--[[
Repeaters where reflectors need to be blocked.
Not in use. 
]]--
local blockReflectorList = {
  [206102] = true, -- ON0DEN
  [206104] = true, -- ON0LED
  [206105] = true, -- ON0APS
  [206106] = true, -- ON0HAM
  [206202] = true, -- ON0KB
  [206300] = true, -- ON0ESB
  [206301] = true, -- ON0DIL
  [206310] = true, -- ON0GAL
  [206501] = true, -- ON0HOP
  [206902] = true  -- ON0PRX
}


--[[
Talkgroups that are allowed on slot 1. The repeaters where this list is applied can be found below.
]]--
local slot1TgList = {
  [724]    = true, -- Belgium
  [4000]   = true, -- Disconnect
  [5000]   = true, -- Info
  [9990]   = true, -- Echo Service
  [724990] = true, -- Messaging Services
  [724997] = true, -- Parrot Application
  [724999] = true -- GPS, RRS & Telemetry Services
}


--[[
List of talkgroups that are used in Belgium
Some repeater sysops don't want external groups
Not in use
]]--
local internalTgList = {
  [2]      = true, -- Local
  [8]      = true, -- Region (Cluster)
  [9]      = true, -- Local & Reflector
  [724]    = true, -- Belgium
  [7241]   = true, -- Belgium North
  [7242]   = true, -- Belgium South
  [7243]   = true, -- Belgium East
  [7244]   = true, -- Belgium ODTG 1
  [7245]   = true, -- Belgium ODTG 2
  [7246]   = true, -- Belgium ODTG 3
  [7247]   = true, -- Belgium ODTG 4
  [7248]   = true, -- Belgium ODTG 5
  [7249]   = true, -- Belgium ODTG 6
  [7240]   = true, -- Belgium ODTG Development & Testing
  [72401]  = true, -- Belgium Fusion North Bridge
  [72402]  = true, -- Belgium Fusion South Bridge
  [724112] = true, -- B-EARS
  [724990] = true, -- Messaging Services
  [724997] = true, -- Parrot Application
  [724999] = true, -- GPS, RRS & Telemetry Services
  [4000]   = true, -- Reflector Disconnect
  [5000]   = true, -- Reflector Info
  [9990]   = true  -- Parrot Application
}


--[[
Main Plug-in logic
]]--


function BRGuard.handleCallSession(kind, name, number, slot, flavor, source, destination)
  if (bit.band(kind, LINK_TYPE_REPEATER) ~= 0) or
    (kind == LINK_TYPE_APPLICATION)
  then
    report('[BRGuard] Kind: ' .. kind .. ' - Name: ' .. name .. ' - Number: ' .. number .. ' - Slot: ' .. slot .. ' - Flavor: ' .. flavor .. ' - Source: ' .. source .. ' - Destination:' .. destination)
  end
    
  -- Do not mess up with FastForward calls
  if (bit.band(kind, LINK_TYPE_NETWORK) ~= 0) then
    return REGISTRY_CONTINUE_APPENDING
  end
    
  -- Drop any reflector call from Brazilian IDs not coming from DV4Mini
  if (destination > 4000) and
    (destination < 5000) and
    (source >= 7240000) and
    (source <= 7249999) and
    (name ~= 'DV4mini')
  then
    report('[BRGuard] Prevented user ' .. source .. ' from using reflector ' .. destination .. ' on gateway ' .. number .. ' slot ' .. slot .. '.')
    return REGISTRY_STOP_APPENDING
  end
	
	-- Restrict TGs on slot 1 of all repeaters
  if (slot1TgList[destination] == nil) and
    (number >= 724000) and
    (number <= 724999) and
    (slot == 1)
  then
    report('[BRGuard] Prevented user ' .. source .. ' from using TG ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '.')
    return REGISTRY_STOP_APPENDING
  end

--  -- Test: Ban any user who call 100
--	if (bit.band(kind, LINK_TYPE_REPEATER) ~= 0) and
--		(destination == 100) then
--		setStoredValue('BlockedUsers', 0, source, 3, 30)
--		report('[BRGuard] User ' .. source .. 'banned for calling 100')
--	end
--
--  -- Drop non-regional TGs on slot 1 of ON1DGR his repeaters
--  if (regionalTgList[destination] == nil) and
--  (blockReflectorList[number] == true) and
--  (slot == 1)
--  then
--    report('[BRGuard] Prevented user ' .. source .. ' from using TG ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '.')
--    return REGISTRY_STOP_APPENDING
--  end
--
--  -- Drop any non-internal destinations for ON0ODR
--  if (number == 206107) and
--  (slot == 2) and
--  (internalTgList[destination] == nil)
--  then
--    report('[BRGuard] Prevented user ' .. source .. ' from using talkgroup ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '.')
--    return REGISTRY_STOP_APPENDING
--  end

  -- Accept all calls by default
  return REGISTRY_CONTINUE_APPENDING

end

return BRGuard
