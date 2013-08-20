app.submitToServer =  function() {
    var userPasscode = document.getElementById('userPasscode').value;
    var numOfUsers = document.getElementById('numOfUsers').value;
    numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;
    
    $.ajax("http://www.smewebsites.com/nuitblanche/submit.php", {
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
		 
			   if (responseObj.advanced>0) {	
					document.getElementById("numUsersContainer").style.display = "block";
				}
				var serverResponse = document.getElementById('serverResponse');
				serverResponse.innerHTML = "Sucess Response from server: " + response;
           },
           error: function(request, errorType, errorMessage) {
            var serverError = document.getElementById('serverResponse');
			serverError.innerHTML = "Error Response from server: " + errorMessage;
           }
    });
};
