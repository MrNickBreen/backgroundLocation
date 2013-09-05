var map;		
var markers = [];
var haveSetBounds=false; //only set bounds on first success
var timeOfLastRefresh = (new Date().getTime() / 1000)-60;
	
function initializeMap() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		center : new google.maps.LatLng(45.427900, -75.672507),
		zoom : 13,
		mapTypeId : google.maps.MapTypeId.SATELLITE,
		mapTypeControlOptions : {
			style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
		}
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	resizeMap();
	
	getMarkerList();
	
	// Update marker positions every x seconds
	setInterval(getMarkerList, 1000*60);	
}

$(window).resize(function() {
	resizeMap();
});

function resizeMap(){
	//Sets map to be full screen.
	 $("#map-canvas").height($(window).height());
}


function resetBounds(){
	var bounds = new google.maps.LatLngBounds();			
	for ( var i = 0; i < markers.length; i++) {
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
function getMarkerList() {

	if(((new Date().getTime() / 1000)-timeOfLastRefresh)<59){
		console.log("too soon");
	}
		else{
			console.log("sending AJAX");
			var searchUrl = '../getMarkers.php';

		$.ajax({
			  type: "GET",
			  url: searchUrl,
			  data: {secret:"Britta"},
			  timeout: 48000,
			  success:  function(data) {
				console.log('got markers!');
			  timeOfLastRefresh = (new Date().getTime() / 1000);

				var markerString = unescape(decodeURIComponent(unescape(decodeURIComponent(data.markers))));
				var tmpMarkers =  jQuery.parseJSON(markerString );
				 
				if(tmpMarkers.length<=0){
				  console.log('fallback to fake data');
				  fakeData();
				}
				else{	
					clearLocations();				
					for(var i=0;i<tmpMarkers.length;i++){
					  var mp=tmpMarkers[i].replace(/\\"/g, "\""); //unescape() wasn't working nor was dec
					  createMarker(jQuery.parseJSON(mp),i);
					}						  
				}

				if(!haveSetBounds){
					resetBounds();
					haveSetBounds=true;
				}
				console.log(data);		  
			  },
			  error: function(request, errorType, errorMessage) {
				timeOfLastRefresh = (new Date().getTime() / 1000);
				console.log('error: '+errorMessage);
			   },
			  dataType: "json"
			});
		}
}

function createMarker( info,  index) {

	var iconImg =  "img/red-circle.png";
	if(info.numOfUsers==2){
		iconImg =  "img/red-circle-2.png";
	}
	if(info.numOfUsers>=3){
		iconImg =  "img/red-circle-3.png";
	}	
		
	var marker = new google.maps.Marker({
		map : map,
		position : new google.maps.LatLng(parseFloat(info.lat),parseFloat(info.lng)),		
		icon : iconImg
	});	
	
	marker.metadata = { id: markers.length};
	markers.push(marker);		
}


function clearLocations() {
	for ( var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}
