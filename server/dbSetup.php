<?php 
/**
* Creates necessary tables: users and userupdates
* Creates row entries in 'users' table, each with a random and unique passcode.
* Only needs to be run once to setup the database, and users must be cleared if you want it to run again.
*
* echos out json array of all of the new users:
* 	[{"id":263,"passcode":4218 },{...},...]
*/

require 'config.php'; //makes connection to database

// creates tables if they don't exist
createTables();

// Check if we need to create users
if(numCurrentUsers() > 0){
	echo 'Error: Already users in the database. You must empty the "users" table before we add new ones.';
}
else{
	createUserEntries();
}


mysql_close($con);


/**
* Creates the two tables: users and userupdates if they don't already exist
*/
function createTables(){
	$query = "CREATE TABLE IF NOT EXISTS `users` (
	  `id` int(11) NOT NULL AUTO_INCREMENT,
	  `passcode` int(5) DEFAULT NULL,
	  `deviceId` int(11) DEFAULT NULL,
	  `activated` tinyint(1) DEFAULT NULL,
	  `advancedAccount` tinyint(1) DEFAULT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=221";

	$result = mysql_query($query)or die($query."   - ".mysql_error());
	
		$query = "CREATE TABLE IF NOT EXISTS `userupdates` (
	  `id` int(11) NOT NULL AUTO_INCREMENT,
	  `userId` int(11) NOT NULL,
	  `jsonString` varchar(512) NOT NULL,
	  `dateModified` datetime NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13686";

	$result = mysql_query($query)or die($query."   - ".mysql_error());
}

/**
* Creates user entries with unique random passcodes.
* 
*/
function createUserEntries(){
	$response_array = array();
	for( $i = 0; $i < NUM_USERS; $i++){
		$passcode = generatePasscode($i);
		$advancedAccount=0;
		
		if($i<10){
			$advancedAccount=1;
		}
		
		$query='INSERT INTO `users`(id, passcode,activated,advancedAccount)
					VALUES (NULL,'.$passcode.',0,'.$advancedAccount.' )';

		$result = mysql_query($query)or die($query."   - ".mysql_error());

		$response['id'] = mysql_insert_id();
		$response['passcode'] = $passcode;
		array_push($response_array,$response);
	}
		echo json_encode($response_array);
}


/**
* Generate random int passcodes that are unique.
*/
function generatePasscode($index){
	return $index * PASSCODE_RANGE + rand(0,(PASSCODE_RANGE-1));
}


/**
* Check how many user rows currently exist.
*/
function numCurrentUsers(){
	$query='SELECT COUNT(*) FROM users';
	$result = mysql_query($query)or die($query."   - ".mysql_error());
	return mysql_result($result, 0);
}


?>