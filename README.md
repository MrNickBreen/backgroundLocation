Phonegap 3.0 Background Location App
====================================

Phonegap 3.0 app that can run in the background and sends current gps location to a server.  
  
Developed using the new Phonegap 3.0 Command Line Interface, so the top level www directory is where all editing should take place, then just build for whichever platforms you wish to target.  
  
We have developed and tested this app on iOS and Android. In theory it will work on all devices that Phonegap supports, such as Windows Phone, Blackberry, for a full list check http://phonegap.com/  
  
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

	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git


iOS
===

Allow update GPS in background
------------------------------
Once you have performed 'phonegap build ios', Open the resources subfolder in xcode, click the .plist file, add a new row, Type 'Required background modes', in the first index select 'App registers for location updates'.


Server Code
===========

* /Map/..: Map website to view users
* /dbSetup.php: onetime use for creating tables with users and unique int passcodes
* /submit.php: for accepting gps updates and adding them to database
* /getMarkers.php code for getting latest GPS update for each user, returns json


Server Setup
------------

1. Open up phpmyadmin on your server and create a database and user.  
- Update config.php to reflect the database settings you created.
- Upload all of the files to your server.
- Visit dbSetup.php once to run it. This creates database tables and users with passcodes.
- Check phpmyadmin to see some of the passcodes, try them on the app.



TODOs
=====

* App: Factor out server communication specific code into its own object.
* Passcode security was not a top priority for this app, they are predictable and vulnerable. If passcode security is concern rewrite the passcode generation section.
* Some developers claim that if PHP responds it should always be success, and ajax error should just be for 404's etc. Research and adjust code accordingly.






