/**
 * Created by jupiterli on 29/01/2017.
 */


(function() {
  EventSponsor
    .controller("LoginCtrl", function($scope, LogService, BackendService, CacheDataService, MessageBoxService) {

      $scope.inputs = {
        loginInfo : {
          username : '',
          password : ''
        }
      };

      var init = function() {
        log("Start to init Login");

        $scope.title = "Login";

        log("Finished to init Login");
      };

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
        return "LoginCtrl: " + content;
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = init;

      $scope.login = function () {
        BackendService.login($scope.inputs.loginInfo, function () {
          // login succeed
          MessageBoxService.showTestAlertBox(CacheDataService.getCurrentUsername());
          $scope._closeLoginModal();
        }, function () {
          // login failed
        })
      };


    });
})();
