(function(calcentralperf) {

  'use strict';

  // Set the configuration
  calcentralperf.config(['$locationProvider', function($locationProvider) {

    // We set it to html5 mode so we don't have hash bang URLs
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

})(window.calcentralperf);
