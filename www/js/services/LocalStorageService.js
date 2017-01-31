/**
 * Created by jupiterli on 28/01/2017.
 *
 */


(function() {

  EventSponsor
    .service('LocalStorageService', ['$localStorage', 'LogService', 'LocalDataFactory', 'UserFactory', LocalStorageService]);

  function LocalStorageService($localStorage, LogService, LocalDataFactory, UserFactory) {


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
      return "LocalStorageService: " + content;
    }

    /**
     * @description
     *
     * Initialise local storage with default values
     * Involved at first time
     * */
    function initWithDefault() {
      log("Initialise local data.");
      $localStorage.EventSponsorLocalData = LocalDataFactory.getInstance();

      var guestUser = UserFactory.getInstance();
      guestUser.username = GUEST_USERNAME;
      guestUser.password = GUEST_USERNAME;
      guestUser.dispalyName = 'Guest';
      $localStorage.EventSponsorLocalData.users.push(guestUser);

      $localStorage.EventSponsorLocalData.currentUser = guestUser;
    }

    /**
     * @description
     *
     * Get user by username
     * */
    function getUserByUsername(username) {
      for (var i = 0; i < $localStorage.EventSponsorLocalData.users.length; i++) {
        if (username == $localStorage.EventSponsorLocalData.users[i].username) {
          return $localStorage.EventSponsorLocalData.users[i];
        }
      }

      return null;
    }

    function updateLocalDataByUser(user) {
      for (var i = 0; i < $localStorage.EventSponsorLocalData.users.length; i++) {
        if (user.username == $localStorage.EventSponsorLocalData.users[i].username) {
          $localStorage.EventSponsorLocalData.users[i] = user;
        }
      }
    }

    function getGuestUser() {
      for (var i = 0; i < $localStorage.EventSponsorLocalData.users.length; i++) {
        if (GUEST_USERNAME == $localStorage.EventSponsorLocalData.users[i].username) {
          return $localStorage.EventSponsorLocalData.users[i];
        }
      }

      var guestUser = UserFactory.getInstance();
      guestUser.username = GUEST_USERNAME;
      guestUser.password = GUEST_USERNAME;
      guestUser.dispalyName = 'Guest';

      return guestUser;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      /**
       * @description
       *
       * Clear all local data
       * */
      clearLocalData : function () {
        log("Clear all local data.");
        initWithDefault();
      },
      loadUserLocalDataByUsername : function (username) {
        if (!$localStorage.EventSponsorLocalData) {
          initWithDefault();
        }

        return getUserByUsername(username);
      },
      addUserData : function (user) {
        if (!$localStorage.EventSponsorLocalData) {
          initWithDefault();
        }

        $localStorage.EventSponsorLocalData.users.push(user);
      },
      updateUserData : updateLocalDataByUser,

      getCurrentUser : function () {
        if (!$localStorage.EventSponsorLocalData) {
          initWithDefault();
        }

        return $localStorage.EventSponsorLocalData.currentUser;
      },
      setCurrentUser : function (user) {
        if (!$localStorage.EventSponsorLocalData) {
          initWithDefault();
        }

        $localStorage.EventSponsorLocalData.currentUser = user;
      },
      setCurrentUserToGuest : function () {
        if (!$localStorage.EventSponsorLocalData) {
          initWithDefault();
        }

        $localStorage.EventSponsorLocalData.currentUser = getGuestUser();
      }
    }
  }

})();
