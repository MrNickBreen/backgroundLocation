<?php 
require 'config.php'; //makes connection to database

$response_array['advanced'] = 0;
$response_array['message'] = 'tbd';	
$response_array['status'] = 'success';	// convention that if a server gives a controlled response that's a success

$deviceId = 0;
$passcode = 0 ;
$marker = 0;


//Check post 
if (isset($_GET['deviceId']) 
	&& isset($_GET['passcode']) 
	&& isset($_GET['marker'])){
	
	$deviceId = $_GET['deviceId'];
	$passcode = $_GET['passcode'];
	$marker = urlencode($_GET['marker']);

}
else{
	$response_array['message'] = 'missing params';	
	echo json_encode($response_array);
	mysql_close($con);
	die();
}


//check if authorized:
$userId = getUser($deviceId, $passcode);
if ($userId  != -1){
	
	//insert into DB
	$query='INSERT INTO `userupdates`(`id`, userId, jsonString, dateModified)
				VALUES (NULL, '.$userId .',"'.$marker.'" ,NOW())';
				
	$result = mysql_query($query)or die($query."   - ".mysql_error());
	$response_array['id'] = mysql_insert_id();
	$response_array['message'] = 'Successful update.';
	$response_array['status'] = 'success';

}
else{
	$response_array['message'] = 'not authorized';	
}

echo json_encode($response_array);
mysql_close($con);


//Return int of userId or -1 if not valid
function getUser($deviceId, $passcode){
	global $response_array;
	
	if($passcode=='' || !is_numeric($passcode)){
		return -1;
	}
	
	//retrieve entry with that passcode	
	$query="SELECT id, deviceId, advancedAccount FROM `users` WHERE passcode =  ".$passcode." LIMIT 0,1";
	$result = mysql_query($query)or die($query . " -\n ".mysql_error());								
	
	if(is_resource($result) && mysql_num_rows($result) > 0 ){
		$row = mysql_fetch_array($result);
		$response_array['advanced'] = $row['advancedAccount'];
		
		//New entry
		if ($row['deviceId'] == NULL) {
			//set users.deviceId and return true
			$query="UPDATE users SET deviceId = ".$deviceId." WHERE id =  ".$row['id'];
			$result = mysql_query($query)or die($query . " -\n ".mysql_error());			
			return $row['id'];
		}
		else{ // already activated
			if ($row['deviceId'] == $deviceId){

				return $row['id'];
			}
			else{
				return -1;
			}
		}
	}
	else
		return -1;
	}

?>