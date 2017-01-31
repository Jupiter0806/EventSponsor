/**
 * Created by jupiterli on 29/01/2017.
 */

(function() {
  EventSponsor
    .controller("BarcodeCtrl", function($scope, LogService, $ionicPopover, BarcodeScannerService, MessageBoxService, BarcodeFactory, UUIDService, CacheDataService, FileSystemService) {

      var barcodePopover = null;

      $scope.publishedBarcodes = [];

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
        return "BarcodeCtrl: " + content;
      }

      function getPublishedBarcodesFromLocalData() {
        $scope.publishedBarcodes = CacheDataService.getCurrentUserPublishedBarcodes();
      }

      /* ***********************************************************************************************
       *
       * public function
       *
       * ************************************************************************************************/
      $scope.init = function () {
        log("Start to init Barcode page");

        $scope.title = "Barcode";

        log("Initialise barcode popover");
        $ionicPopover.fromTemplateUrl('templates/barcodePages/barcode-popover.html', {
          scope: $scope
        }).then(function(popover) {
          barcodePopover = popover;
        });

        log("Initialise data-publishedBarcodes");
        getPublishedBarcodesFromLocalData();

        log("Finished to init Barcode page");
      };

      /**
       * @description
       *
       * Barcode popover related functions
       *
       * */
      $scope.showBarcodePopover = function ($event) {
        if (barcodePopover) {
          barcodePopover.show($event);
        } else {
          warn("Barcode popover does not initialised properly, cannot show it.")
        }
      };
      $scope._hideBarcodePopover = function () {
        if (barcodePopover) {
          if (barcodePopover.isShown) {
            barcodePopover.hide();
          }
        } else {
          warn("Barcode popover does not initialised properly, cannot show it.")
        }
      };

      /**
       * @description
       *
       * Barcode related functions
       *
       * */
      $scope._scanBarcode = function () {
        log("Scan barcode.");
        BarcodeScannerService.scan(function (uuid) {
          log("Scan result is " + uuid);
          MessageBoxService.showTestAlertBox("Scan result is " + uuid);
          CacheDataService.validateBarcodeByUUID(uuid, function () {
            MessageBoxService.showAlert("Valid barcode.");
          }, function (errorMsg) {
            MessageBoxService.showAlert(errorMsg);
          })
        }, function (error) {
          log("Scan failed due to " + JSON.stringify(error));
          MessageBoxService.showTestAlertBox("Failed " + JSON.stringify(error));
        })
      };
      $scope._generateBarcode = function () {
        log("Generate a barcode.");
        var barcode = BarcodeFactory.getInstance();
        barcode.UUID = UUIDService.get();
        barcode.pulisher = CacheDataService.getCurrentUsername();
        barcode.generatedTime = moment().format('Do MMMM YYYY, h:mm:ss a');

        // test Barcode viewer modal
        // $scope._setupAndOpenBarcodeViewerModal('test/img/844dbb97-af56-42fc-867e-a13af561e320.jpeg');

        BarcodeScannerService.encode(barcode.UUID, function (barcodeImgUrl) {
          barcode.imgName = FileSystemService.getFilenameFromFilePath(barcodeImgUrl);

          $scope._setupAndOpenBarcodeViewerModal(barcodeImgUrl);

          CacheDataService.addBarcodeToCurrentUser(barcode);

          getPublishedBarcodesFromLocalData();
        }, function (errorMsg) {
          MessageBoxService.showAlert("Generate a barcode failed due to " + errorMsg
            + ".\n Please try again. If this issue still exists, contact us.");
        })
      };

      /**
       * @description
       *
       * Not in use
       * */
      $scope._setBarcodeValid = function (barcodeUUID) {
        CacheDataService.setBarcodeValidByBarcodeUUID(barcodeUUID, function () {
          MessageBoxService.showAlert("Has set");
        }, function (errorMsg) {
          MessageBoxService.showAlert("Failed due to " + errorMsg);
        })
      }

    });
})();
