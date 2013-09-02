Phonegap 3.0 Background Location App
====================================

Phonegap 3.0 app that can run in the background and sends current gps location to a server.  
  
Developed using the new Phonegap 3.0 Command Line Interface, so the top level www directory is where all editing should take place, then just build for whichever platforms you wish to target.  
We have developed and tested this app on iOS and Android. In theory, but no promises, it will work on all devices that Phonegap supports: Windows Phone, Blackberry, for a full list check http://phonegap.com/  
  
We have tried to make the UI conform to iOS apple store standards. Our app is currently waiting for approval, we will update once it is approved/rejected.

Libraries Used
==============

* FastClick - removes 300ms lag in most mobile browsers. Gives native feel.
* jQuery Mobile - For easy mobile UI and nav, don't use any/many features from it.
* jQuery - make JavaScript life easier


Plugins Used
============

Network Information

	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git

GeoLocation

	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git

Splash Screen

	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git

Notifications

	ordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git


iOS
===

Allow update GPS in background
------------------------------
Once you have performed 'phonegap build ios', Open the resources subfolder in xcode, click the .plist file, add a new row, Type 'Required background modes', in the first index select 'App registers for location updates'.
