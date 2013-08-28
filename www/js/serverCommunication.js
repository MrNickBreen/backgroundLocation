app.submitToServer =  function() {
    var userPasscode = document.getElementById('userPasscode').value;
    var numOfUsers = document.getElementById('numOfUsers').value;
    numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;
    
	
	if(((new Date().getTime() / 1000)- app.timeLastSubmit ) > 59 || app.forcedSubmit){
		app.timeLastSubmit = new Date().getTime() / 1000;
		app.checkConnection();

		$.ajax("http://artengine.ca/nnrbeacons/submit.php", {
			   contentType:"application/json",
			   type:"GET",
			   data: {
				   "passcode": userPasscode,
				   "deviceId": app.deviceId,
				   "marker": JSON.stringify({
					   "numOfUsers":numOfUsers,
					   "lat":app.position.coords.latitude,
					   "lng":app.position.coords.longitude,
					   "accuracy":app.position.coords.accuracy,
					   "heading":app.position.coords.heading
					})
			   },
			   timeout: 10000,
			   success:function(response){
                    var responseObj =  jQuery.parseJSON(response );
					var serverResponse = document.getElementById('serverResponse');
					serverResponse.innerHTML = "auto-submit: "+ responseObj.message+": "+ app.getReadableTime( new Date());

               	if(responseObj.message == "not authorized"){
						if(app.forcedSubmit){
							app.forcedSubmit=false;
                            navigator.notification.alert("This passcode is not authorized. Try again or contact Britta. Your device id is: "+app.deviceId, null, "99 Red Beacons Tracker");
						}
						$(serverResponse).removeClass("success");
						$(serverResponse).addClass("fail");
					}
					else{
						if(app.forcedSubmit){
                            navigator.notification.alert("Success. Thank you!", null, "99 Red Beacons Tracker");
							app.forcedSubmit=false;
						}	
						$(serverResponse).removeClass("fail");
						$(serverResponse).addClass("success");
						
						//Show or hide num of users option
						if (responseObj.advanced>0) {	
							document.getElementById("numUsersContainer").style.display = "block";
						}
						else{
							document.getElementById("numUsersContainer").style.display = "none";
						}
					}
			   },
			   error: function(request, errorType, errorMessage) {
				var serverError = document.getElementById('serverResponse');
					$(serverError).removeClass("success");
					$(serverError).addClass("fail");
				serverError.innerHTML = "Error: " + errorMessage+" "+app.getReadableTime( new Date());
				if(app.forcedSubmit){
                    navigator.notification.alert("Error, please check your internet connection", null, "99 Red Beacons Tracker");
					app.forcedSubmit=false;
				}
			   }
		});
	}
	else{
	//Too Soon: commented out because not useful for user and confusing.
		//var serverError = document.getElementById('serverResponse');
		//serverError.innerHTML = "Too soon: "+app.getReadableTime( new Date()) ;
	}
};
