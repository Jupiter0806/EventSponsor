// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var EventSponsor = angular.module('EventSponsor', ['ionic', 'ngCordova', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, FileSystemService, WechatShareService, BarcodeScannerService, CacheDataService, LogService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // initialise services
    log("Start initialising APP");
    BarcodeScannerService.init();
    WechatShareService.init();

    CacheDataService.init();
    if (CacheDataService.isLogin()) {
      FileSystemService.init(CacheDataService.getCurrentUsername(), function(){}, function(){MessageBoxService.showAlert("Errors occur during file system initialisation. Please restart app to resolve this problem. If this problem still exists, please contact us.")});
    } else {
      // no user login before, using guest account
      FileSystemService.init(GUEST_USERNAME, function(){}, function(){MessageBoxService.showAlert("Errors occur during file system initialisation. Please restart app to resolve this problem. If this problem still exists, please contact us.")});
    }

    $rootScope._isDeviceReady = true;


    function log(content) {
      LogService.log(formatContent(content));
    }

    function warn(content) {
      LogService.warn(formatContent(content));
    }

    function error(content) {
      LogService.error(formatContent(content));
    }

    function debug(content) {
      LogService.debug(formatContent(content));
    }

    function formatContent (content) {
      return "APP: " + content;
    }
  });
})

;
