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

  $filters = array(
    "HyteraPTT RoIP",
    "DCS Link",
    "D-Extra Link",
    "WIRES-X Link",
    "YSF Client",
    "NXDN Client",
    "WinMaster",
    "XLX Interlink",
    "CBridge CC-CC Link",
    "Simple External Application",
    "Parrot"
  );

  print($header);
  $delimiter = "";

  $connection = new DBus(DBus::BUS_SYSTEM, true);

  foreach ($GLOBALS["Services"] as $instance => $service)
  {
    // Read data from each BrandMeister daemon instance
    $proxy = $connection->createProxy($service, OBJECT_PATH, INTERFACE_NAME);

    foreach ($filters as $filter)
    {
      $result = $proxy->getContextList($filter);
      if ((is_object($result)) &&
          (get_class($result) == "DbusArray"))
      {
        $list = $result->getData();
        foreach ($list as $banner)
        {
          $parameters = array();
          $parameters["instance"] = $instance;

          $result = $proxy->getContextData($banner);
          if ((is_object($result)) &&
              (get_class($result) == "DbusSet"))
          {
            $set = $result->getData();
            $parameters["banner"]  = $set[0];
            $parameters["name"]    = $set[1];
            $parameters["type"]    = $set[2];
            $parameters["number"]  = $set[3];
            $parameters["caption"] = $set[7];
          }

          $result = $proxy->getSubscriptionList($banner);
          if ((is_object($result)) &&
              (get_class($result) == "DbusArray"))
          {
            $list = $result->getData();
            foreach ($list as $entry)
            {
              $set = $entry->getData();
              $parameters["slot"]        = $set[0];
              $parameters["flavor"]      = $set[1];
              $parameters["destination"] = $set[2];
              $parameters["tag"]         = $set[3];

              $data = json_encode($parameters);
              print($delimiter . $data);
              $delimiter = ", ";
            }
          }
        }
      }
    }
  }

  print($footer);

?>