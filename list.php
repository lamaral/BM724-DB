<?php
  header("Access-Control-Allow-Origin: *");
  require_once("../status/common.php");

  if (array_key_exists("callback", $_GET))
  {
    header("Content-Type: application/javascript");
    $header = $_GET["callback"] . "([";
    $footer = "])";
  }
  else
  {
    header("Content-Type: application/json");
    $header = "[";
    $footer = "]";
  }

  print($header);
  $delimiter = "";

  $connection = new DBus(DBus::BUS_SYSTEM, true);

  foreach ($GLOBALS["Services"] as $instance => $service)
  {
    // Read data from each BrandMeister daemon instance
    $proxy = $connection->createProxy($service, OBJECT_PATH, INTERFACE_NAME);
    $index = 0;

    do
    {
      $entry = NULL;

      $type     = new DbusUInt32(1);
      $position = new DbusUInt32($index);
      $result   = $proxy->getCustomList($type, $position);

      if ((is_object($result)) &&
          (get_class($result) == "DbusArray"))
      {
        $list = $result->getData();
        foreach ($list as $entry)
        {
          $set = $entry->getData();

          $parameters = array(
            "instance"   => $instance,
            "banner"     => $set[0],
            "type"       => $set[1],
            "number"     => $set[2],
            "name"       => $set[3],
            "hardware"   => $set[4],
            "firmware"   => $set[5],
            "frequency1" => escape($set[7]),
            "frequency2" => escape($set[8]),
            "color"      => $set[9],
            "link"       => $set[10],
            "extra"      => $set[11]
          );

          $data = json_encode($parameters);
          print($delimiter . $data);
          $delimiter = ", ";
          $index ++;
        }
      }
    }
    while (is_object($entry));
  }

  print($footer);

?>