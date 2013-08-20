app.submitToServer =  function() {
    var userPasscode = document.getElementById('userPasscode').value;
    $.ajax("http://www.smewebsites.com/nuitblanche/submit.php", {
           contentType:"application/json",
           type:"GET",
           data: {
               "passcode": userPasscode,
               "deviceId": app.deviceId,
               "marker": JSON.stringify({
                   "numOfUsers":1,
                   "lat":app.position.coords.latitude,
                   "lng":app.position.coords.longitude,
                   "accuracy":app.position.coords.accuracy,
                   "heading":app.position.coords.heading
                })
           },
           timeout: 10000,
           success:function(response){
            serverResponse = document.getElementById('serverResponse');
            serverResponse.innerHTML = "Sucess Response from server: " + response;
           },
           error: function(request, errorType, errorMessage) {
            serverError = document.getElementById('serverResponse');
           serverError.innerHTML = "Error Response from server: " + errorMessage;
           },
           complete: function() {
            setInterval(app.submitToServer, 1000*30);
           }
    });
};
