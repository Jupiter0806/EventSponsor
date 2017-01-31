/**
 * Created by jupiterli on 28/01/2017.
 */

(function() {
  EventSponsor
    .controller("TestCtrl", function($scope, LogService, MessageBoxService, BackendService, LocalStorageService) {

      var init = function() {
        log("Start to init Test");

        $scope.title = "Test";

        log("Finished to init Test");
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
        return "TestCtrl: " + content;
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = init;

      // message box
      $scope.showAlert = function () {
        MessageBoxService.showAlert("message", "title");
      };

      $scope.clearLocalData = LocalStorageService.clearLocalData;


    });
})();
