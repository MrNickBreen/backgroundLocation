/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    userId: 0,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        app.initUserId();
    },
    initUserId: function() {
        var permanentStorage = window.localStorage;
        this.userId = permanentStorage.getItem("userId");
        if (this.userId === null) {
            permanentStorage.setItem("userId", Math.floor((Math.random()*100000)));
            this.userId = permanentStorage.getItem("userId");
        }
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.checkConnection();
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError, {enableHighAccuracy: true, timeout: 20000 });
        alert('about to submit to server');
        app.submitToServer();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },
    checkConnection: function() {
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        
        elem = document.getElementById('connectionInfo');
        elem.innerHTML = 'Connection type: ' + states[networkState];
    },
    onSuccess: function(position) {
        app.position = position;
        elem = document.getElementById('locationInfo');
        elem.innerHTML = ('Latitude: '   + position.coords.latitude  + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +'Heading: '           + position.coords.heading           + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    },
    onError: function(error) {
        elem = document.getElementById('locationInfo');
        elem.innerHTML = ('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
};