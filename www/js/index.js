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
var app = {
	SERVER_URL: "http://artengine.ca/nnrbeacons/submit.php",
	HIGH_GPS_ACCURACY: false,	
	
	
    deviceId: 0,
	passcode:0,
    GPSWatchId: null,
	timeLastSubmit:0,
	gpsErrorCount:0,
	forcedSubmit:false, //set if user explicitly presses submit button. Used to determine if we show alert boxes.
	
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
        this.initUserId();
		this.initPasscode();
        this.initView();
		app.timeLastSubmit = (new Date().getTime() / 1000)-60; //minus 60 so we trigger web call first time.
    },
	bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    initFastClick: function () {
        window.addEventListener('load', function() {
                                FastClick.attach(document.body);
                                }, false);
    },
    initUserId: function() {
        var permanentStorage = window.localStorage;
        this.deviceId = permanentStorage.getItem("deviceId");
        if (this.deviceId === null) {
            permanentStorage.setItem("deviceId", Math.floor((Math.random()*100000)));
            this.deviceId = permanentStorage.getItem("deviceId");
        }
    },
	initPasscode: function() {
        var permanentStorage = window.localStorage;
        this.passcode = permanentStorage.getItem("passcode");
		var passcodeText='';
        if (this.passcode === null) {
            passcodeText ='';
        }
		else{
			passcodeText = this.passcode;
		}
		$('#userPasscode').val(passcodeText);
    },
    initView: function() {
        if (this.passcode === null) {
            $('#settingsPage #enterPasswordInstruction').show();
            $('#statusPage').hide();
            $('#settingsPage').show();
        }
    },
    onDeviceReady: function() {
        navigator.splashscreen.hide();
        app.checkConnection();
        app.initGPSToggleListener();
        app.startGPS();
    },
    initGPSToggleListener: function() {
        $('#locationToggle').bind( "change", function(event, ui) {
            if (this.value == "true") {
                app.startGPS();
             }
             else {
                app.stopGPS();
             }
         });
    },
    startGPS: function() {
        app.GPSWatchId = navigator.geolocation.watchPosition(app.onGPSSuccess, app.onGPSError, {enableHighAccuracy: app.HIGH_GPS_ACCURACY, timeout: 1000*60*4 , maximumAge: 1*1000 });
    },
    stopGPS: function() {
        navigator.geolocation.clearWatch(app.GPSWatchId);
    },
    checkConnection: function() {
        var networkState = navigator.connection.type;
		
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI]     = 'WiFi';
        states[Connection.CELL_2G]  = 'Cell 2G';
        states[Connection.CELL_3G]  = 'Cell 3G';
        states[Connection.CELL_4G]  = 'Cell 4G';
        states[Connection.CELL]     = 'Cell';
        states[Connection.NONE]     = 'No';
        
        elem = document.getElementById('connectionInfo');
		if(networkState == Connection.NONE){
			$(elem).removeClass("success");
			$(elem).addClass("fail");
		}
       	else {
			$(elem).removeClass("fail");
			$(elem).addClass("success");			
		}
		elem.innerHTML = 'Internet: ' + states[networkState];
    },
    onGPSSuccess: function(position) {
		//reset error counter
		gpsErrorCount=0;
		
        app.position = position;
        app.submitToServer();
        
        elem = document.getElementById('locationInfo');
		$(elem).removeClass("fail");
		$(elem).addClass("success");
        elem.innerHTML = ('Latitude: '   + position.coords.latitude.toFixed(3)  + '<br/>' +
              'Longitude: '         + position.coords.longitude.toFixed(3)         + '<br/>' +
              'Last Update: '         + app.getReadableTime( position.timestamp));
    },
    onGPSError: function(error) {
		app.gpsErrorCount++;

		
		if(app.gpsErrorCount>3){	
			elem = document.getElementById('locationInfo');
			$(elem).removeClass("success");
			$(elem).addClass("fail");
			elem.innerHTML = ('There is an error, restarting GPS. '+ app.getReadableTime( new Date())+"<br/> message:"+ error.message);
			console.log('error with GPS: error.code:'+error.code    + ' and error message: ' + error.message);	
			
			// Restart GPS listener, fixes most issues.
			app.stopGPS();
			app.startGPS();			
		}
    },
	getReadableTime: function(time){
		var hours = time.getHours();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
		
		return (hours + ':' + app.padZero(time.getMinutes()) +':'+ app.padZero(time.getSeconds())+ ' ' + ampm);
	},
	padZero:function(num){
		return (num<10 ? '0'+num:num);
	}
};

$("#userPasscode").focusout(function () {
     var permanentStorage = window.localStorage;
     permanentStorage.setItem("passcode", $("#userPasscode").val());
    this.passcode = $("#userPasscode").val();
    if ($("#userPasscode").val() !== "" && $('#settingsPage #enterPasswordInstruction').is(":visible")) {
                            $('#settingsPage #enterPasswordInstruction').hide();
    }
});

 $("#submit-passcode").click(function() {
	app.forcedSubmit=true; //forces pop-up
    app.submitToServer();
});

$(document).delegate('.ui-navbar a', 'click', function () {
                     $(this).addClass('ui-btn-active');
                     $('.content_div').hide();
                     $('#' + $(this).attr('data-href')).show();
                     });
					 
				
