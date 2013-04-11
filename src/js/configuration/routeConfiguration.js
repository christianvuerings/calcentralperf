(function(calcentralperf) {

  'use strict';

  // Set the configuration
  calcentralperf.config(['$routeProvider', function($routeProvider) {

    // List all the routes
    $routeProvider.when('/', {
      templateUrl: 'templates/main.html',
      controller: 'mainController'
    });

  }]);

})(window.calcentralperf);
