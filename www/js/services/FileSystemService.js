/**
 * Created by jupiterli on 28/01/2017.
 */


(function() {

  EventSponsor
    .service('FileSystemService', ['LogService', '$cordovaFile', '$q', FileSystemService]);

  function FileSystemService(LogService, $cordovaFile, $q) {

    // parent directory name for barcode img dir, which is the username
    var parentDir = null;

    var barcodeImgDir = 'barcodeImages';
    var barcodeImgDirEntry = null;



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
      return "FileSystemService: " + content;
    }

    /**
     * @description
     *
     * Create home directory for this user isolate user's data
     *
     * */
    function createHomeDirForThisUser(username, onSuccess, onError) {
      // var purposeMessage = "create a directory for this user to isolate files between different users.";

      requestFileSystem(function (fileSystem) {
        createDirectory(fileSystem, '', username, function (dirEntry) {
          onSuccess();
        }, onError);
      }, function (errorMsg) {
        if (parseErrorMessage(errorMsg) == 12) {
          // directory exists error, ignore it.
          onSuccess();
        } else {
          onError(errorMsg);
        }
      });
    }

    /**
     * @description
     *
     * Create barcode image dir under home dir
     *
     * */
    function createBarcodeImgDir(onSuccess, onError) {
      requestFileSystem(function (fileSystem) {
        createDirectory(fileSystem, parentDir, barcodeImgDir, function (dirEntry) {
          barcodeImgDirEntry = dirEntry;
          onSuccess();
        }, onError);
      }, function (errorMsg) {
        if (parseErrorMessage(errorMsg) == 12) {
          // this path is never run, because this directory will be immediately created after
          //  create home directory. If home directory already exists, this function will not
          //  be involved.

          // directory exists error, ignore it.
          onSuccess();
        } else {
          onError(errorMsg);
        }
      });
    }

    /* ***********************************************************************************************
     *
     * barcode images function
     *
     * ************************************************************************************************/

    /**
     * @description
     *
     * Move barcode image located at @filePath to Barcode Image Directory and set its name to @targetFilename
     * */
    function moveBarcodeImageToItsDirectory(filePath, targetFilename, onSuccess, onError) {
      log("Move " + filePath + " to barcode image directory named as " + targetFilename);

      var oldFilename = filePath.split('/')[filePath.split('/').length -1];
      var oldFileDir = filePath.replace(oldFilename, '');
      if (filePath.indexOf('file://') !== 0) {
        oldFileDir = 'file://' + filePath.replace(oldFilename, '');
      }

      moveTo(oldFileDir, oldFilename, getBarcodeImageDirectory() , targetFilename, onSuccess, onError);
    }

    function getBarcodeImageDirectory() {
      return barcodeImgDirEntry.nativeURL;
    }

    /* ***********************************************************************************************
     *
     * public function
     *
     * ************************************************************************************************/


    var READ_TYPE = {
      'TEXT' : 0,
      'DATA_URL' : 1,
      'BINARY_STRING' : 2,
      'ARRAY_BUFFER' : 3
    };

    var errorMessages = [
      'not found',
      'security error',
      'abort error',
      'not readable',
      'encoding error',
      'no modification allowed',
      'invalid state',
      'syntax error',
      'invalid modification',
      'quota exceeded error',
      'type mismatch error',
      'path exists error'
    ];

    function parseErrorCode(code) {

      if (typeof code == 'string') {
        // this is a json error, still dont know it meaning.
        return code;
      }

      log("Error code is " + code);

      return errorMessages[code - 1];
    }

    function parseErrorMessage(message) {
      return errorMessages.indexOf(message) + 1;
    }

    /**
     * @description
     *
     * Request file system
     *
     * @param onSuccess, success callback fileSystem
     * @param onError, error callback error message
     * */
    function requestFileSystem(onSuccess, onError) {
      if (typeof LocalFileSystem == 'undefined') {
        warn("Local File System is not available.");
        onError("Local File System is not available.");
      }

      var fileSystemType = LocalFileSystem.PERSISTENT;
      // here is 0 is because in the plugin documentation, it is 0
      var requestSize = 0;

      var purposeMessage = 'Request file system';

      var requestFunction = window.requestFileSystem || window.webkitRequestFileSystem;

      requestFunction(fileSystemType, requestSize, function (fileSystem) {
        log(purposeMessage + " SUCCEED.");
        onSuccess(fileSystem);
      }, function (error) {
        var errorMessage = parseErrorCode(error.code);
        log(purposeMessage + " FAILED due to " + errorMessage);
        onError(errorMessage);
      })

    }

    /**
     * @description
     *
     * Create directory on @fileSystem at @relativePath by name of @directoryName
     *
     * @param fileSystem, object of fileSystem, should get from requestFileSystem
     * @param relativePath, the relative path to the directory about to create
     * @param directoryName, the name of the directory about to create
     * @param onSucceed, success callback
     * @param onError, failed callback
     *
     * */
    function createDirectory(fileSystem, relativePath, directoryName, onSucceed, onError) {

      var purposeMessage = "create a directory named by " + directoryName + " at " + relativePath;

      log("Attempt to " + purposeMessage);

      if (fileSystem) {
        if (relativePath != '') {
          getDirectoryEntry(fileSystem.root, relativePath, function (directoryEntry) {

            directoryEntry.getDirectory(directoryName, { create : true, exclusive : true}, onThisSuccess, onThisError);

          }, function (errorMessage) {
            log("Failed to get directory of " + relativePath);
            onError(errorMessage);
          })
        } else {
          fileSystem.root.getDirectory(directoryName, { create : true, exclusive : true}, onThisSuccess, onThisError)
        }
      }

      function onThisSuccess(subdirectoryEntry){
        var path = subdirectoryEntry.toURL();
        log("Succeed to " + purposeMessage + " at " + path);
        onSucceed(subdirectoryEntry);
      }

      function onThisError(error){
        if (error.code == 12) {
          log("This directory does exist, no need to create a new one.");
          if (relativePath == '') {
            fileSystem.root.getDirectory(directoryName, { create : false }, onThisSuccess, onThisError)
          } else {
            getDirectoryEntry(fileSystem.root, relativePath, function (directoryEntry) {

              directoryEntry.getDirectory(directoryName, { create : false }, onThisSuccess, onThisError);

            }, function (errorMessage) {
              log("Failed to get directory of " + relativePath);
              onError(errorMessage);
            })
          }
        }
        var errorMessage = parseErrorCode(error.code);
        log("Failed to " + purposeMessage + " due to " + errorMessage);
        onError(errorMessage);      }

    }

    /**
     * to be honest, to use resolveLocalSystemURL is a easier way to implement this function and easier to understand the
     *  code, but i did not notice this before I implement this.
     *
     * Anyway, this function is working, but may not do fast. May change to the other solution someday
     *
     * @param directoryEntry, the parent directory entry
     * @param relativePath, a string, relative path from root to the directory
     * @param onSucceed, success callback
     * @param onError, failed callback
     *
     *
     * sample structure
     *
     * {
     *  "isFile":false,
     *  "isDirectory":true,
     *  "name":"audioMessages",
     *  "fullPath":"/lux/audioMessages/",
     *  "filesystem":"<FileSystem: persistent>",
     *  "nativeURL":"file:///Users/jupiterli/Library/Developer/CoreSimulator/Devices/2A9BDE7C-D3A6-4535-B118-B22686541952/data/Containers/Data/Application/667935CD-4DC1-484B-80ED-3F3DDEBFB77E/Documents/lux/audioMessages/"
     * }
     * */
    function getDirectoryEntry(directoryEntry, relativePath, onSucceed, onError){
      var purposeMessage = 'get directory entry of ' + relativePath;

      var subDirectoryName = relativePath.slice(0, relativePath.indexOf('/'));
      var remainPath = relativePath.slice(relativePath.indexOf('/') + 1, relativePath.length - 1);

      directoryEntry.getDirectory(subDirectoryName, { create : false }, onThisSuccess, onThisError);

      function onThisSuccess(subDirectoryEntry){
        log("Succeed to " + purposeMessage);
        if (remainPath != '') {
          getDirectoryEntry(subDirectoryEntry, relativePath, onSucceed, onError);
        } else {
          onSucceed(subDirectoryEntry);
        }
      }

      function onThisError(error){
        var errorMessage = purposeMessage(error.code);
        log("Failed to " + purposeMessage + " due to " + errorMessage);
        error(errorMessage);
      }

    }

    /**
     * @description
     *
     * Move a file from @oldDirectory named by @oldFilename to @newDirectory named by @newFilename
     *
     *
     * */
    function moveTo(oldDirectory, oldFilename, newDirectory, newFilename, onSuccess, onError) {
      log("Move " + oldFilename + " at " + oldDirectory + " to " + newFilename + " at " + newDirectory);
      $cordovaFile.moveFile(oldDirectory, oldFilename, newDirectory, newFilename).then(onSuccess, function (error) {
        log("Failed to " + "Move " + oldFilename + " at " + oldDirectory + " to " + newFilename + " at " + newDirectory + " due to " + parseErrorCode(error.code));
        onError(parseErrorCode(error.code));
      });
    }

    function getReadTypeText(readType) {
      switch (readType) {
        case READ_TYPE.TEXT : return 'text';
        case READ_TYPE.DATA_URL : return 'data url';
        case READ_TYPE.BINARY_STRING : return 'binary string';
        case READ_TYPE.ARRAY_BUFFER : return 'array buffer';
        default : return 'unknown type';
      }
    }

    function readFileAs(fileEntry, readType, onSuccess, onError) {
      var purposeMessage = 'attempt to read a file as ' + getReadTypeText(readType);

      if (getReadTypeText(readType).indexOf('unknown') != -1) {
        log("Unknown read type, read as text.");
      }

      log("Attempt to " + purposeMessage);

      fileEntry.file(onThisSuccess, onThisError);

      function onThisSuccess(file){

        var fileReader = new FileReader();

        fileReader.onloadend = function () {
          log("Succeed to " + purposeMessage);
          onSuccess(this.result);
        };

        switch (readType) {
          case READ_TYPE.TEXT:
            fileReader.readAsText(file);
            break;
          case READ_TYPE.DATA_URL:
            fileReader.readAsDataURL(file);
            break;
          case READ_TYPE.BINARY_STRING:
            fileReader.readAsBinaryString(file);
            break;
          case READ_TYPE.ARRAY_BUFFER:
            fileReader.readAsArrayBuffer(file);
            break;
          default :
            fileReader.readAsText(file);

        }
      }
      function parseErrorCode(code) {

        if (typeof code == 'string') {
          // this is a json error, still dont know it meaning.
          return code;
        }

        log("Error code is " + code);

        return errorMessages[code - 1];
      }

      function onThisError(error){
        var errorMessage = parseErrorCode(error.code);
        log("Failed to " + purposeMessage + " due to " + errorMessage);
        onError(errorMessage);
      }

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
       * Initialise filesystem with username
       * */
      init : function (username, onSuccess, onError) {
        username = username || GUEST_USERNAME;

        parentDir = username + '/';

        createHomeDirForThisUser(username, function () {
          createBarcodeImgDir(onSuccess, onError);
        }, onError)

      },
      moveBarcodeImageToItsDirectory : moveBarcodeImageToItsDirectory,
      getBarcodeImageDirectory : getBarcodeImageDirectory,

      // helpers
      getFileExtensionFromFilePath : function (filePath) {
        return filePath.slice(filePath.lastIndexOf('.'), filePath.length);
      },
      getFilenameFromFilePath : function (filePath) {
        return filePath.split('/')[filePath.split('/').length -1];
      },

      readFileAsDataUrl : function (url, onSuccess, onError) {
        window.resolveLocalFileSystemURL(url.indexOf("file://") == -1 ? "file://" + url : url, function (fileEntry) {
          readFileAs(fileEntry, READ_TYPE.DATA_URL, onSuccess, onError);
        }, onError);
      }
    }
  }

})();
