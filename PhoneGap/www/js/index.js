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
	SERVER_URL : "http://artengine.ca/nnrbeacons/submit.php",
	HIGH_GPS_ACCURACY : false,	// some emulators require true.

	position : null,
	deviceId : 0,
	passcode : 0,
	timeLastSubmit : 0,
	forcedSubmit : false, // set if user explicitly presses submit button.
							// Used to determine if we show alert boxes.

	// Application Constructor
	initialize : function() {
		this.bindEvents();
		this.initFastClick();
		this.initUserId();
		this.initPasscode();
		this.initView();
		app.timeLastSubmit = (new Date().getTime() / 1000) - 60; 
	},
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady : function() {
		navigator.splashscreen.hide();
		app.checkConnection();
		gps.init();
	},
	initFastClick : function() {
		window.addEventListener('load', function() {
			FastClick.attach(document.body);
		}, false);
	},
	initUserId : function() {
		var permanentStorage = window.localStorage;
		this.deviceId = permanentStorage.getItem("deviceId");
		if (this.deviceId === null) {
			permanentStorage.setItem("deviceId", Math
					.floor((Math.random() * 100000)));
			this.deviceId = permanentStorage.getItem("deviceId");
		}
	},
	initPasscode : function() {
		var permanentStorage = window.localStorage;
		this.passcode = permanentStorage.getItem("passcode");
		var passcodeText = '';
		if (this.passcode === null) {
			passcodeText = '';
		} else {
			passcodeText = this.passcode;
		}
		$('#userPasscode').val(passcodeText);
	},
	initView : function() {
		if (this.passcode === null) {
			$('#settingsPage #enterPasswordInstruction').show();
			$('#statusPage').hide();
			$('#settingsPage').show();
		}
	},
	checkConnection : function() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN] = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI] = 'WiFi';
		states[Connection.CELL_2G] = 'Cell 2G';
		states[Connection.CELL_3G] = 'Cell 3G';
		states[Connection.CELL_4G] = 'Cell 4G';
		states[Connection.CELL] = 'Cell';
		states[Connection.NONE] = 'No';

		elem = $('#connectionInfo');
		if (networkState == Connection.NONE) {
			this.failElement(elem);
		} else {
			this.succeedElement(elem);
		}
		elem.innerHTML = 'Internet: ' + states[networkState];
	},
	getReadableTime : function(time) {
		var hours = time.getHours();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12;

		return (hours + ':' + app.padZero(time.getMinutes()) + ':'
				+ app.padZero(time.getSeconds()) + ' ' + ampm);
	},
	padZero : function(num) {
		return (num < 10 ? '0' + num : num);
	},
	succeedElement : function(elem) {
		elem.removeClass("fail");
		elem.addClass("success");
	},
	failElement : function(elem) {
		elem.removeClass("success");
		elem.addClass("fail");
	}
};
$(function() {
	$("#userPasscode").focusout(
			function() {
				var permanentStorage = window.localStorage;
				permanentStorage.setItem("passcode", $("#userPasscode").val());
				this.passcode = $("#userPasscode").val();
				if ($("#userPasscode").val() !== ""
						&& $('#settingsPage #enterPasswordInstruction').is(
								":visible")) {
					$('#settingsPage #enterPasswordInstruction').hide();
				}
			});

	$("#submit-passcode").click(function() {
		app.forcedSubmit = true; // forces pop-up
		app.submitToServer();
	});

	$(document).delegate('.ui-navbar a', 'click', function() {
		$(this).addClass('ui-btn-active');
		$('.content_div').hide();
		$('#' + $(this).attr('data-href')).show();
	});

});