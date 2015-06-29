</p>
<?php
$mysql_db_hostname = "localhost";
$mysql_db_user = "root";
$mysql_db_password = "12345";
$mysql_db_database = "school";

&nbsp;

$con = @mysqli_connect($mysql_db_hostname, $mysql_db_user, $mysql_db_password,
 $mysql_db_database);

if (!$con) {
 trigger_error('Could not connect to MySQL: ' . mysqli_connect_error());
}
$var = array();
 $sql = "SELECT * FROM users";
$result = mysqli_query($con, $sql);

while($obj = mysqli_fetch_object($result)) {
  $var[] = $obj;
}
echo '{"users":'.json_encode($var).'}';
?>
<p style="text-align: justify;">
