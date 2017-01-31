/**
 * Created by jupiterli on 29/01/2017.
 */

(function() {
  EventSponsor
    .controller("HomepageCtrl", function($scope, LogService) {

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
        return "HomepageCtrl: " + content;
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = function () {
        log("Start to init Homepage");

        $scope.title = 'Home';

        log("Finished to init Homepage");
      }

    });
})();
