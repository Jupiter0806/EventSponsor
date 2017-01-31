/**
 * Created by jupiterli on 29/01/2017.
 */


(function() {

  EventSponsor
    .service('BackendService', ['LogService', 'UserFactory', 'CacheDataService', BackendService]);

  function BackendService(LogService, UserFactory, CacheDataService) {

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
      return "BackendService: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      register : function (regInfo, onSuccess, onError) {
        onSuccess();
      },
      login : function (loginInfo, onSuccess, onError) {
        var user = UserFactory.getInstance();
        user.username = loginInfo.username;
        user.password = loginInfo.password;
        user.displayName = loginInfo.username;

        CacheDataService.setCurrentUser(user);

        onSuccess();
      },
      logout : function (onSuccess, onError) {

        CacheDataService.setCurrentUserToGuest();

        onSuccess();
      },

      /**
       * @description
       *
       * Get current login user data from server
       * */
      getUserData : function () {

      },

      /**
       * @description
       *
       * Event relate functions are not in use
       * Create a event on server
       *
       * */
      createAEvent : function () {

      },
      /**
       * @description
       *
       * Update a event info on server
       * */
      updateEvent : function () {

      },
      /**
       * @description
       *
       * Delste a event on server
       * */
      delateEvent : function () {

      },

      /**
       * @description
       *
       * Validate a barcode
       * */
      validateBarcode : function () {

      }
    }
  }

})();
