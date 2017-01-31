/**
 * Created by jupiterli on 16/11/2016.
 */

(function() {

  EventSponsor
    .service('BarcodeScannerService', ['LogService', 'FileSystemService', 'UUIDService', BarcodeScannerService]);

  function BarcodeScannerService(LogService, FileSystemService, UUIDService) {

    var service = null;
    var isInitialised = false;

    function isServiceAvailable() {
      return isInitialised && service;
    }

    function log(content) {
      LogService.log(formatContent(content));
      return formatContent(content);
    }

    function warn(content) {
      LogService.warn(formatContent(content));
      return formatContent(content);
    }

    function error(content) {
      LogService.error(formatContent(content));
      return formatContent(content);
    }

    function debug(content) {
      LogService.debug(formatContent(content));
      return formatContent(content);
    }

    function formatContent (content) {
      return "BarcodeScannerService: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      init : function () {
        log("Initialise BarcodeScannerService");
        if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
          service = cordova.plugins.barcodeScanner;
        }

        isInitialised = true;
      },

      /**
       * @description
       * success callback with the context
       *
       * */
      scan : function (onSuccess, onError) {
        if (isServiceAvailable()) {
          service.scan(
            function (result) {
              log("Scan barcode succeed with message: " + JSON.stringify(result));
              onSuccess(result.text);
            },
            function (error) {
              (log("Scan barcode failed due to " + JSON.stringify(error)));
              onError(JSON.stringify(error));
            },
            {
              "preferFrontCamera" : false, // iOS and Android
              "showFlipCameraButton" : true, // iOS and Android
              "prompt" : "Place a barcode inside the scan area", // supported on Android only
              "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
          );
        } else {
          onError(log("Service is not available."));
        }
      },

      /**
       * @description
       * For now only support text encode as hard coded the encode type.
       *
       * success callback with the img url, the img is located in tmp directory on ios, and it will be replaced by newer
       *  encodings.
       *
       * */
      encode : function (text, onSuccess, onError) {
        if (isServiceAvailable()) {
          service.encode(service.Encode.TEXT_TYPE, text, function(success) {
              log("Encode text of " + text + " succeed.");
              debug("Encode success callback " + JSON.stringify(success));
              var barcodeImgName = text + FileSystemService.getFileExtensionFromFilePath(success.file);
              FileSystemService.moveBarcodeImageToItsDirectory(success.file, barcodeImgName, function () {
                onSuccess(FileSystemService.getBarcodeImageDirectory() + barcodeImgName);
              }, function (errorMsg) {
                warn("Move barcode image to its directory failed due to " + errorMsg);
                onError(errorMsg);
              });
              // onSuccess(success.file);
            }, function(fail) {
              log("Encode text of " + text + " failed due to " + fail);
              debug("Encode fail callback " + JSON.stringify(fail));
              onError(fail);
            }
          );
        } else {
          onError(log("Service is not available."));
        }
      }
    }
  }

})();
