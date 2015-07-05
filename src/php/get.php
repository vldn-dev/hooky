<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("http://vldn.de", "root", "jSfsjJhwZ72DmK", "hooky");

$result = $conn->query("SELECT id, user FROM rooms");

$outp = "[";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "[") {$outp .= ",";}
    $outp .= '{"ID":"'  . $rs["id"] . '",';
    $outp .= '"User":"'. $rs["user"]     . '"}'; 
}
$outp .="]";

$conn->close();

echo($outp);
?>
