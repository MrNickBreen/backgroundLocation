<?php 
require 'config.php'; //makes connection to database

Submit::processSubmit();


class Submit {

	static  $response_array = array('advanced'=>0,'message'=>'','status'=>'success');
	static $userId = 0;
	static $deviceId  = 0;
	static $passcode = 0 ;
	static $marker = 0;

	
	static public function processSubmit(){	
		global $con;	
		
		self::getParams();
		self::$userId = self::getUserId(self::$deviceId, self::$passcode);
		
		//check if user is authorized:
		if (self::$userId  != -1){
			self::addLocationToDB();
		}
		else{
			self::$response_array['message'] = 'not authorized';	
		}

		echo json_encode(self::$response_array);
		mysql_close($con);
	}



	/**
	* Return int of userId or -1 if not valid
	*/
	static function getUserId($deviceId, $passcode){
		
		if($passcode=='' || !is_numeric($passcode)){
			return -1;
		}
		
		//retrieve entry with that passcode	
		$query="SELECT id, deviceId, advancedAccount FROM `users` WHERE passcode =  ".$passcode." LIMIT 0,1";
		$result = mysql_query($query)or die($query . " -\n ".mysql_error());								
		
		if(is_resource($result) && mysql_num_rows($result) > 0 ){
			$row = mysql_fetch_array($result);
			self::$response_array['advanced'] = $row['advancedAccount'];
			
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
		else{
			return -1;
		}
	}
		

	static function addLocationToDB(){		
		$query='INSERT INTO `userupdates`(`id`, userId, jsonString, dateModified)
					VALUES (NULL, '.self::$userId .',"'.self::$marker.'" ,NOW())';
					
		$result = mysql_query($query)or die($query."   - ".mysql_error());
		self::$response_array['id'] = mysql_insert_id();
		self::$response_array['message'] = 'Successful update.';
		self::$response_array['status'] = 'success';

	}
		
	static function getParams(){
		global $con;	

		if (isset($_GET['deviceId']) 
			&& isset($_GET['passcode']) 
			&& isset($_GET['marker'])){
			
			self::$deviceId = $_GET['deviceId'];
			self::$passcode = $_GET['passcode'];
			self::$marker = urlencode($_GET['marker']);

		}
		else{
			self::$response_array['message'] = 'missing params';	
			echo json_encode(self::$response_array);
			mysql_close($con);
			die();
		}
	}
}
?>