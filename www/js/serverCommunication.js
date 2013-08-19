app.submitToServer =  function() {
    alert('submit to server');
    var twitterHandle = document.getElementById('twitterHandle').value;
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
            alert('got success from server, response:' +response);
           },
           error: function(request, errorType, errorMessage) {
            alert('error!: '+errorMessage+' and error type:'+errorType+' and request:'+request);
           }
    });
};
