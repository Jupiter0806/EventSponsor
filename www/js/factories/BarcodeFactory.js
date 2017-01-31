/**
 * Created by jupiterli on 28/01/2017.
 */


(function() {
  EventSponsor
    .factory("BarcodeFactory", ['LogService', BarcodeFactory]);

  function BarcodeFactory(LogService) {

    function Barcode() {
      this._isBarcodeObject = true;

      this.imgName = ""; // instead of url, here uses name is because the app id is changeable every time the app start, so the url changed
      this.UUID = ""; // the uuid of this barcode to identify this barcode
      this.scanTimes = 0; // how many times this barcode has been scanned
      this.isValid = true; // to indicate whether this barcode is valid, in some cases a barcode can only be scanned once
      this.generatedTime = ''; // string to store the time when this barcode generated

      this.pulisher = null; // an object of user to indicate who generate and publish this barcode
      this.owner = null; // an object of user to indicate this barcode send to whom

      this.isUploaded = false; // whether uploaded to server
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
      return "BarcodeFactory: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      getInstance : function () {
        log("Create a new barcode instance.");
        return new Barcode();
      }
    }

  }

})();
