/* 
 * David Rust-Smith & Nick Breen - August 2013
 *
 * Apache 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. 
 */
app.submitToServer =  function() {
    var serverURL = "http://artengine.ca/nnrbeacons/submit.php";	
	var userPasscode = document.getElementById('userPasscode').value;
    var numOfUsers = document.getElementById('numOfUsers').value;
    numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;
    
	
	if(((new Date().getTime() / 1000)- app.timeLastSubmit ) > 59 || app.forcedSubmit){
		app.timeLastSubmit = new Date().getTime() / 1000;
		app.checkConnection();

		$.ajax(serverURL, {
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
					app.serverSuccess(response);
			   },
			   error: function(request, errorType, errorMessage) {
				var serverError = document.getElementById('serverResponse');
					$(serverError).removeClass("success");
					$(serverError).addClass("fail");
				serverError.innerHTML = "Error: " + errorMessage+" :"+app.getReadableTime( new Date());
				if(app.forcedSubmit){
					alert("Error, please check your internet connection");
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

app.serverSuccess(response){
	var responseObj =  jQuery.parseJSON(response );
	var serverResponse = document.getElementById('serverResponse');
	serverResponse.innerHTML = "auto-submit: "+ responseObj.message+": "+ app.getReadableTime( new Date());

	if(responseObj.message == "not authorized"){
		if(app.forcedSubmit){
			app.forcedSubmit=false;
			alert("This passcode is not authorized. Try again or contact Britta. Your device id is: "+app.deviceId);
		}
		$(serverResponse).removeClass("success");
		$(serverResponse).addClass("fail");
	}
	else{
		if(app.forcedSubmit){
			alert("Success. Thank you!");
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
};
