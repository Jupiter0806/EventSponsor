/**
 * Created by jupiterli on 28/01/2017.
 */


(function() {

  EventSponsor
    .service('CacheDataService', ['$rootScope', 'LogService', 'LocalStorageService', CacheDataService]);

  function CacheDataService($rootScope, LogService, LocalStorageService) {

    var _userData = null;
    var _isLogin = false;

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
      return "CacheDataService: " + content;
    }

    function getBarcodeObjectByBarcodeUUID(barcodeUUID) {
      for (var i = 0; i < _userData.publishedBarcodes.length; i++) {
        if (_userData.publishedBarcodes[i].UUID == barcodeUUID) {
          return _userData.publishedBarcodes[i];
        }
      }
      return null;
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
       * Initialise cache data
       *
       *  1. load local storage data
       * */
      init : function () {
        log("Initialise cache data.");

        log("Load local storage data.");
        _userData = LocalStorageService.getCurrentUser();

        if (_userData && _userData.username !== GUEST_USERNAME) {
          _isLogin = true;
          $rootScope._isLogin = true;
        }
      },

      isLogin : function () {
        return _isLogin;
      },

      getCurrentUsername : function () {
        if (_userData) {
          return _userData.username;
        } else {
          return null;
        }
      },
      /**
       * @description
       *
       * Update cache data user data. and then update local storage current user.
       *
       *
       * */
      setCurrentUser : function (user) {
        if (user.username == _userData.username) {
          // suppose not reach this point
        } else {
          var localUserData = LocalStorageService.loadUserLocalDataByUsername(user.username);
          if (localUserData) {
            // has local data, replace local data
            LocalStorageService.updateUserData(user);

          } else {
            // has no local data, this user is new on this system
            LocalStorageService.addUserData(user);
          }
        }

        _userData = user;
        LocalStorageService.setCurrentUser(user);
      },

      setCurrentUserToGuest : function () {
        _userData.password = '';

        LocalStorageService.setCurrentUserToGuest();

        _userData = LocalStorageService.getCurrentUser();
        _isLogin = false;
        $rootScope._isLogin = false;
      },

      addBarcodeToCurrentUser : function (barcode) {
        // test code
        // alert(JSON.stringify(_userData));
        _userData.publishedBarcodes.push(barcode);
      },
      getCurrentUserPublishedBarcodes : function () {
        return _userData.publishedBarcodes;
      },

      /**
       * @description
       *
       * Validate barcode
       *
       * For now the algorithm is one barcode only can be used once, second time validation will failed
       * */
      validateBarcodeByUUID : function (barcodeUUID, onSuccess, onError) {
        for (var i = 0; i < _userData.publishedBarcodes.length; i++) {
          if (_userData.publishedBarcodes[i].UUID == barcodeUUID) {
            if (_userData.publishedBarcodes[i].isValid) {
              _userData.publishedBarcodes[i].isValid = false;
              _userData.publishedBarcodes[i].scanTimes++;

              onSuccess();
              return;
            } else {
              onError("This barcode has been used.");
              return;
            }
          }
        }

        onError("Invalid barcode.");
      },

      /**
       * @description
       *
       * Force set a barcode as valid
       * */
      setBarcodeValidByBarcodeUUID : function (barcodeUUID, onSuccess, onError) {
        var barcodeObject = getBarcodeObjectByBarcodeUUID(barcodeUUID);

        if (barcodeObject) {
          barcodeObject.isValid = true;
          onSuccess();
        } else {
          onError("Nor found this barcode.");
        }
      }
    }
  }

})();
