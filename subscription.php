<?php
header("Access-Control-Allow-Origin: *");
require_once("../status/common.php");

$connection = new DBus(DBus::BUS_SYSTEM, true);
$proxy = $connection->createProxy(SERVICE_NAME, OBJECT_PATH, INTERFACE_NAME);

$array = array();

$filters = array(
    "DCS Link",
    "D-Extra Link",
    "WIRES-X Link",
    "YSF Client",
    "WinMaster",
    "XLX Interlink",
    "CBridge CC-CC Link",
    "Simple External Application",
    "Parrot"
);
  
foreach ($filters as $filter) {
    $result = $proxy->getContextList($filter);
    if ((is_object($result)) && (get_class($result) == "DbusArray")) {
        $list = $result->getData();
        foreach ($list as $banner) {
            $parameters = array();

            $result = $proxy->getContextData($banner);
            if ((is_object($result)) && (get_class($result) == "DbusSet")) {
                $set                   = $result->getData();
                $values = $set[6]->getData();
                $parameters["banner"]  = $set[0];
                $parameters["name"]    = $set[1];
                $parameters["type"]    = $set[2];
                $parameters["number"]  = $set[3];
                $parameters["caption"] = $set[7];
            }

            $result = $proxy->getSubscriptionList($banner);
            if ((is_object($result)) && (get_class($result) == "DbusArray")) {
                $list = $result->getData();
                foreach ($list as $entry) {
                    $set = $entry->getData();
                    $parameters["slot"]        = $set[0];
                    $parameters["flavor"]      = $set[1];
                    $parameters["destination"] = $set[2];
                    $parameters["tag"]         = $set[3];

                    $array[] = $parameters;
                }
            }
        }
    }
}

$data = json_encode($array);

if (array_key_exists("callback", $_GET)) {
    header("Content-Type: application/javascript");
    print($_GET["callback"] . "(" . $data . ")");
} else {
    header("Content-Type: application/json");
    print($data);
}
?>
