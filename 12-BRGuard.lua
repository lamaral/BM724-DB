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
Talkgroups that are not allowed on slot 1.
]]--
local blockedSlot1TgList = {
  
}

--[[
Talkgroups that are not allowed on slot 2.
]]--
local blockedSlot2TgList = {
  [724]    = true,
}


--[[
Main Plug-in logic
]]--


function BRGuard.handleCallSession(kind, name, number, slot, flavor, source, destination)
  if (bit.band(kind, LINK_TYPE_REPEATER) ~= 0) 
  then
    report('[BRGuard] Kind: ' .. kind .. ' - Name: ' .. name .. ' - Number: ' .. number .. ' - Slot: ' .. slot .. ' - Flavor: ' .. flavor .. ' - Source: ' .. source .. ' - Destination: ' .. destination)
  end
    
  -- Do not mess up with FastForward calls
  if (bit.band(kind, LINK_TYPE_NETWORK) ~= 0) then
    return REGISTRY_CONTINUE_APPENDING
  end
    
  -- Drop any reflector call from Brazilian IDs not coming from DV4Mini
  if (destination > 4000) and
    (destination < 5000) and
    (number >= 724000) and
    (number <= 724999) and
    (name ~= 'DV4mini')
  then
    report('[BRGuard] Prevented user ' .. source .. ' from using reflector ' .. destination .. ' on gateway ' .. number .. ' slot ' .. slot .. '. REFTS3')
    return REGISTRY_STOP_APPENDING
  end
	
	-- Drop any private calls from Brazilian IDs in slot 1
	if (destination > 7240000) and
    (destination < 7249999) and
    (number >= 724000) and
    (number <= 724999) and
		(flavor == 5) and
    (slot == 1)
  then
		report('[BRGuard] Prevented user ' .. source .. ' from making a private call to user ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '. PRIVTS1')
    return REGISTRY_STOP_APPENDING
	end
	
	-- Drop any calls from Brazilian IDs to repeater TGs  in slot 1 (724000- 724900)
	if (destination > 724000) and
    (destination < 724900) and
    (number >= 724000) and
    (number <= 724999) and
    (slot == 1)
  then
		report('[BRGuard] Prevented user ' .. source .. ' from making a call to ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '. RPTTGS1')
    return REGISTRY_STOP_APPENDING
	end
	

  
  -- Restrict TGs on slot 2 of all repeaters
  if (blockedSlot2TgList[destination] == true) and
    (number >= 724000) and
    (number <= 724999) and
    (slot == 2)
  then
    report('[BRGuard] Prevented user ' .. source .. ' from using TG ' .. destination .. ' on repeater ' .. number .. ' slot ' .. slot .. '. BLKRPTTS2')
    return REGISTRY_STOP_APPENDING
  end

--  -- Test: Ban any user who call 100
--	if (bit.band(kind, LINK_TYPE_REPEATER) ~= 0) and
--		(destination == 100) then
--		setStoredValue('BlockedUsers', 0, source, 3, 30)
--		report('[BRGuard] User ' .. source .. 'banned for calling 100')
--	end


  -- Accept all calls by default
  return REGISTRY_CONTINUE_APPENDING

end

return BRGuard
