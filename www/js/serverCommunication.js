app.submitToServer =  function() {
    var twitterHandle = document.getElementById('twitterHandle').value;
    // TODO: confirm our position is set, if not, delay and check again
	$.ajax("http://www.ottawasheart.com/server/update.php", {
           contentType:'application/json',
           data: {
               "twitterHandle": twitterHandle,
               "uid": app.userId,
               "position": {
                   "lat":app.position.coords.latitude,
                   "lng":app.position.coords.longitude,
                   "accuracy":app.position.coords.accuracy,
                   "heading":app.position.coords.heading
                }
           },
           timeout: 2000,
           success:function(response){
            serverResponse = document.getElementById('serverResponse');
            serverResponse.innerHTML = response;
           },
           error: function(request, errorType, errorMessage) {
            serverError = document.getElementById('serverResponse');
            serverError.innerHTML = response;
           
           },
           complete: function() {
            setInterval(app.submitToServer, 1000*30);
           }
    });
};
