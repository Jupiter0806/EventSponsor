/**
 * Created by jupiterli on 16/07/2016.
 */

(function() {

  EventSponsor
    .service('UUIDService', ['LogService', UUIDService]);

  function UUIDService(LogService) {

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
      return "UUIDService: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
        get : function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
    }
  }

})();
