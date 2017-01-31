/**
 * Created by jupiterli on 28/01/2017.
 */


(function() {
  EventSponsor
    .factory("UserFactory", ['LogService', UserFactory]);

  function UserFactory(LogService) {

    function User() {
      this._isUserObject = true;

      this.username = ""; // username for login
      this.password = ""; // password for login

      this.displayName = ""; // user used to display. not in use

      this.publishedBarcodes = []; // an array of Barcode this user published
      this.ownedBarcodes = []; // an array of Barcode this user owned, not in use
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
      return "UserFactory: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      getInstance : function () {
        log("Create a new User instance.");
        return new User();
      }
    }

  }

})();
