<?php
  //header("Access-Control-Allow-Origin: *");

  require_once("../status/common.php");

  $array = array();

  $connection = new DBus(DBus::BUS_SYSTEM, true);
  $proxy = $connection->createProxy(SERVICE_NAME, OBJECT_PATH, INTERFACE_NAME);

  $filter = new DbusUInt32(2);
  $result = $proxy->getContextList($filter);
  if ((is_object($result)) &&
      (get_class($result) == "DbusArray"))
  {
    $list = $result->getData();
    foreach ($list as $banner)
    {
      $parameters = array();

      $result = $proxy->getContextData($banner);
      if ((is_object($result)) &&
          (get_class($result) == "DbusSet"))
      {
        $set = $result->getData();
        $parameters["banner"] = $set[0];
        $parameters["type"]   = $set[1];
      }

      $result = $proxy->getRepeaterData($banner);
      if ((is_object($result)) &&
          (get_class($result) == "DbusSet"))
      {
        $set = $result->getData();
        $parameters["number"]     = $set[1];
        $parameters["name"]       = $set[2];
        $parameters["hardware"]   = $set[3];
        $parameters["firmware"]   = $set[4];
        $parameters["frequency1"] = escape($set[6]);
        $parameters["frequency2"] = escape($set[7]);
        $parameters["color"]      = $set[8];
        $parameters["link"]       = $set[9];
        $parameters["extra"]      = $set[10];
      }

      if (count($parameters) > 2)
      {
        // Add valid repeaters only
        $array[] = $parameters;
      }
    }
  }

  $data = json_encode($array);

  if (array_key_exists("callback", $_GET))
  {
    header("Content-Type: application/javascript");
    print($_GET["callback"] . "(" . $data . ")");
  }
  else
  {
    header("Content-Type: application/json");
    print($data);
  }

?>
