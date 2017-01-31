/**
 * Created by jupiterli on 29/01/2017.
 */


(function() {
  EventSponsor
    .controller("TabsCtrl", function($scope, LogService, $ionicModal, $timeout, WechatShareService, FileSystemService) {

      var loginModal = null;

      $scope._barcodeViewer_barcodeUrl = ''; // for barcode display
      var barcodeViewerModal = null;

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
        return "TabsCtrl: " + content;
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = function () {
        log("Start to init Tabs");

        $scope.title = "Tabs";

        log("Initialise modals");


        log("Finished to init Tabs");
      };

      /**
       * @description
       *
       * Login modal open and close
       * */
      $scope._openLoginModal = function () {
        $ionicModal.fromTemplateUrl('templates/tabs/LoginModal.html',{
          scope : $scope,
          animation : 'slide-in-up'
        }).then(function (modal) {
          loginModal = modal;

          loginModal.show();
        });
      };
      $scope._closeLoginModal = function () {
        if (loginModal) {
          if (loginModal.isShown()) {
            loginModal.hide();

            $timeout(function () {
              loginModal.remove();
              loginModal = null;
            }, MS_REMOVE_MODAL_AFTER_CLOSE);
          }
        } else {
          warn("Login modal does not initialise properly, cannot close it.");
        }
      };

      /**
       * @description
       *
       * Barcode viewer setupOpen and close
       * */
      $scope._setupAndOpenBarcodeViewerModal = function (barcodeUrl) {
        $scope._barcodeViewer_barcodeUrl = barcodeUrl;

        // test
        // alert($scope._barcodeViewer_barcodeUrl);

        $ionicModal.fromTemplateUrl('templates/BarcodeViewerModal.html', {
          scope : $scope,
          animation : 'slide-in-up'
        }).then(function (modal) {
          barcodeViewerModal = modal;

          barcodeViewerModal.show();
        });
      };
      $scope._closeBarcodeViewerModal = function () {
        if (barcodeViewerModal) {
          if (barcodeViewerModal.isShown()) {
            barcodeViewerModal.hide();

            $timeout(function () {
              barcodeViewerModal.remove();
              barcodeViewerModal = null;
            }, MS_REMOVE_MODAL_AFTER_CLOSE);
          }
        } else {
          warn("Barcode viewer does not initialise properly, cannot close it.");
        }
      };

      $scope._getBarcodeImgUrlByImageName = function (imgName) {
        return FileSystemService.getBarcodeImageDirectory() + imgName;
      };

      /**
       * @description
       *
       * Share barcode via wechat
       * */
      $scope._sendBarcodeViaWeChat = function () {
        var sharingBarcodeUrl = $scope._barcodeViewer_barcodeUrl;

        var options = new WechatShareService.WechatShareOptions();
        options.title = 'barcode';
        options.description = 'Event validated barcode.';

        WechatShareService.shareImgToSession(sharingBarcodeUrl, options, function () {
          MessageBoxService.showAlert("Barcode has been sent.");
        }, function (errorMsg) {
          MessageBoxService.showAlert("Send barcode failed due to " + errorMsg)
        })
      }

    });
})();
