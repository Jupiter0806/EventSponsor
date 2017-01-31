/**
 * Created by jupiterli on 30/01/2017.
 */

(function() {
  EventSponsor
    .controller("AccountCtrl", function($scope, LogService, BackendService) {



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
        return "AccountCtrl: " + content;
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = function () {
        log("Start to init Account");

        $scope.title = "Account";

        log("Finished to init Account");
      };

      $scope.logout = function () {
        BackendService.logout(function () {
          // logout succeed
        }, function () {
          // logout failed
        })
      }

    });
})();
