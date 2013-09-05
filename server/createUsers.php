<?php 
require 'config.php'; //makes connection to database


for( $i = 0; $i<110; $i++){
	$passcode = $i*100 + rand(0,99);
	$advancedAccount=0;
	
	if($i<10){
		$advancedAccount=1;
	}
	
	
	$query='INSERT INTO `users`(id, passcode,activated,advancedAccount)
				VALUES (NULL,'.$passcode.',0,'.$advancedAccount.' )';

	$result = mysql_query($query)or die($query."   - ".mysql_error());

	$response_array['id']=mysql_insert_id();
	$response_array['status'] = 'success';

	echo query. ' - '.json_encode($response_array);

}

mysql_close($con);


?>