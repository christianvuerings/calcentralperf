(function(calcentralperf) {

  'use strict';

  calcentralperf.controller('mainController', [
    '$http',
    '$scope',
    function(
      $http,
      $scope) {

    $scope.urls = {};

    var initializeSizes = function(sizeArray) {
      var sizes = {};
      sizeArray.forEach(function(element) {
        sizes[element] = {
          amount: 0,
          size: 0,
          content: 0
        };
      });
      return sizes;
    };

    var calculateSizes = function(entries) {
      var sizes = initializeSizes(['javascript', 'images', 'datauri', 'css', 'html', 'json']);

      entries.forEach(function(element) {
        var content = element.response.content;
        var mimetype = content.mimeType;
        var testImageType = 'image/';
        var testDataUrl = 'data:image';
        //element.request.url
        if (mimetype === 'text/javascript' || mimetype === 'application/javascript') {
          sizes.javascript.amount++;
          sizes.javascript.size += content.size;
          sizes.javascript.content += content.size-content.compression;
        }
        else if (mimetype.substring(0, testImageType.length) === testImageType &&
          element.request.url.substring(0, testDataUrl.length) !== testDataUrl) {
          sizes.images.amount++;
          sizes.images.size += content.size;
          sizes.images.content += content.size-content.compression;
        }
        else if (element.request.url.substring(0, testDataUrl.length) === testDataUrl) {
          sizes.datauri.amount++;
          sizes.datauri.size += content.size;
          sizes.datauri.content += content.size-content.compression;
        }
        else if (mimetype === 'text/html') {
          sizes.html.amount++;
          sizes.html.size += content.size;
          sizes.html.content += content.size-content.compression;
        }
        else if (mimetype === 'text/css') {
          sizes.css.amount++;
          sizes.css.size += content.size;
          sizes.css.content += content.size-content.compression;
        }
        else if (mimetype === 'application/json') {
          sizes.json.amount++;
          sizes.json.size += content.size;
          sizes.json.content += content.size-content.compression;
        } else {
          console.log(element);
        }
      });
      return sizes;
    };

    var parseData = function(data) {
      data.files.forEach(function(element) {
        var log = element.log;
        var firstpage = log.pages[0];
        var title = log.pages[0].title;
        if (!$scope.urls[title]) {
          $scope.urls[title] = [];
        }
        $scope.urls[title].push({
          date: firstpage.startedDateTime,
          sizes: calculateSizes(log.entries)
        });
      });
    };

    $http.get('json/combined.json').success(parseData);

  }]);

})(window.calcentralperf);
