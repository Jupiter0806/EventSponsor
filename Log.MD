31/01/2017
 1. Almost done local functions.
    1.1 generate barcode
    1.2 store barcode
    1.3 user file system
    1.4 validate barcode
    1.5 barcodes display
    1.6 weChat share
 2. Next need to do is to connect it to FireBase.

27/01/2017
 1. Try to use bower install to install and manage all js libraries.
 2. After installed ngCordova, there was no ngStorage installed. My guess is that
      ngCordova and ngStorage are separated. So using bower install to install
      ngStorage, but it gave me some options to choose,

      Unable to find a suitable version for angular, please choose one:
          1) angular#~1.4.7 which resolved to 1.4.14 and is required by ngStorage#0.3.2
          2) angular#1.4.14 which resolved to 1.4.14 and is required by angular-cookies#1.4.14
          3) angular#1.5.3 which resolved to 1.5.3 and is required by angular-animate#1.5.3, angular-sanitize#1.5.3, ionic#1.3.2
          4) angular#>= 1.0.8 which resolved to 1.6.1 and is required by angular-ui-router#0.2.13
          5) angular#>= 1.2.23 which resolved to 1.6.1 and is required by ngCordova#0.1.27-alpha
      I choosed 1.
   3. ngCordova and ngStorage are install and import into html separately.
   4. discard bower-installed ngStorage as it seems a new library, and I have no much time
        for now, so I prefer to use previous one.
