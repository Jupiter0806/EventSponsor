/**
 * Created by jupiterli on 27/01/2017.
 */

EventSponsor.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'TabsCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.homepage', {
      url: '/homepage',
      views: {
        'tab-homepage': {
          templateUrl: 'templates/tab-homepage.html',
          controller: 'HomepageCtrl'
        }
      }
    })

    .state('tab.barcode', {
      url: '/barcode',
      views: {
        'tab-barcode': {
          templateUrl: 'templates/tab-barcode.html',
          controller: 'BarcodeCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-scan': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.test', {
      url : '/test',
      views: {
        'tab-test' : {
          templateUrl: 'templates/tab-test.html',
          controller: 'TestCtrl'
        }
      }
    })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/homepage');

});
