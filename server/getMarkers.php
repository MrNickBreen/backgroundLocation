<?php 
	require 'config.php'; //makes connection to database
	
	$response_array['status'] = 'tbd';


	$mapMarkers=array();


	//Make sure secret is set to stop random requests.
	if((isset($_GET['secret']) && $_GET['secret']!='Britta')
	|| !isset($_GET['secret'])){
		die("Unauthorized, no secret");
		$response_array['message'] = 'Unauthorized, no secret';	
		$response_array['status'] = 'error';
	}
	
	
	//Get most recent update for each user.
	$query="SELECT 
	  userupdates.id,
	  jsonString
	FROM userupdates
	  INNER JOIN (
		SELECT userId, MAX(id) AS maxsign FROM userupdates GROUP BY userId
	  ) ms ON userupdates.userId = ms.userId AND id = maxsign";
		
	$result = mysql_query($query)or die($query . " -\n ".mysql_error());


	while ($row = @mysql_fetch_assoc($result)){
		$mapMarkers[]= urldecode($row['jsonString']);
	}


	$response_array['status'] = 'success';
	$response_array['markers']= json_encode($mapMarkers);

	echo json_encode($response_array);
	mysql_close($con);


?>