backgroundLocation
==================

Background Phonegap app that sends current gps location to a server.


Plugins you may need to install locally:
=======================================
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git

iOS update GPS in background:
=============================
Once you have performed 'phonegap build ios', Open the resources subfolder in xcode, click the .plist file, add a new row, Type 'Required background modes', in the first index select 'App registers for location updates'.
