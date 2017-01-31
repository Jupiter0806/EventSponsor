/**
 * Created by jupiterli on 26/07/2016.
 */

(function() {

  EventSponsor
    .service('WechatShareService', ['LogService', 'FileSystemService', WechatShareService]);

  function WechatShareService(LogService, FileSystemService) {

    var IS_AVAILABLE = false;

    var IS_INSTALLED = false;

    function WechatShareOptions() {
      this.title = '';
      this.description = '';
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
      return "WechatShareService: " + content;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/

    return {
      IS_AVAILABLE : IS_AVAILABLE,
      IS_INSTALLED : IS_INSTALLED,

      WechatShareOptions : WechatShareOptions,

      init : function() {
        log("Init wechat plugin.");

        if (typeof Wechat !== 'undefined' && Wechat) {
          IS_AVAILABLE = Wechat;

          Wechat.isInstalled(function (installed) {
            IS_INSTALLED = installed;
            IS_INSTALLED ? log("Wechat has installed.") : warn("Wechat has not installed.");
          });
        } else {
          warn("Wechat share service is not available.")
        }
      },

      /**
       * @description
       *
       * options is WechatShareOptions
       * */
      shareImgToSession : function (barcodeUrl, options, onSuccess, onError) {
        log("Share img at " + barcodeUrl);

        if (IS_AVAILABLE) {
          FileSystemService.readFileAsDataUrl(barcodeUrl, function (dataUrl) {
            Wechat.share({
              message : {
                title : options.title,
                description : options.description,
                media : {
                  type : Wechat.Type.IMAGE,
                  image : dataUrl
                }
              },
              scene : Wechat.Scene.SESSION
            }, onSuccess, function (reason) {
              log(reason);
              onError(reason);
            });
          }, function (errorMsg) {
            log("Read barcode as dataUrl failed due to " + JSON.stringify(errorMsg));
            onError(errorMsg);
          });


        } else {
          log("Service is not available.");
        }

      }

    }
  }

})();
