<?php 
header('Access-Control-Allow-Origin: *');


$dbName='your_db';
$dbUser='your_db';
$dbPwd='your_pwd';

$con = mysql_connect("localhost",$dbUser,$dbPwd);
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

// Set the active mySQL database
$db_selected =mysql_select_db($dbName, $con);
if (!$db_selected) {
  die ("Can\'t use db : " . mysql_error());
}

?>