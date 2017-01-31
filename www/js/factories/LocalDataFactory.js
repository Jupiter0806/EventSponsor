/**
 * Created by jupiterli on 28/01/2017.
 */


(function() {
  EventSponsor
    .factory("LocalDataFactory", ['LogService', LocalDataFactory]);

  function LocalDataFactory(LogService) {

    function LocalData() {
      this._isLocalDataObject = true;

      this.currentUser = null; // the current login user

      this.users = []; // an array of users who have login to this system before, a history
    }

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
      return "LocalDataFactory: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      getInstance : function () {
        log("Create a new LocalData instance.");
        return new LocalData();
      }
    }

  }

})();
