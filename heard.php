<?php
//header("Access-Control-Allow-Origin: *");
require_once("../status/common.php");
require_once("../api/config.php");

$connection = new Tarantool($config['tarantool']['host'], $config['tarantool']['port'], $config['tarantool']['user'], $config['tarantool']['password']);
$array      = $connection->select("HeardCalls", time(), "Time", 2000, 0, "le");
$array_filtered = array_values(array_filter($array, function($a)
{
    return $a[4] != "FastForward";
}));

$data = json_encode($array_filtered);

if (array_key_exists("callback", $_GET)) {
    header("Content-Type: application/javascript");
    print($_GET["callback"] . "(" . $data . ")");
} else {
    header("Content-Type: application/json");
    print($data);
}

?>
