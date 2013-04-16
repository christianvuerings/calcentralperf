(function(window, angular) {

  'use strict';

  /**
   * calcentralperf module
   */
  var calcentralperf = angular.module('calcentralperf', []);

  // Bind calcentralperf to the window object so it's globally accessible
  window.calcentralperf = calcentralperf;

})(window, window.angular);
;(function(calcentralperf) {

  'use strict';

  // Set the configuration
  calcentralperf.config(['$locationProvider', function($locationProvider) {

    // We set it to html5 mode so we don't have hash bang URLs
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

})(window.calcentralperf);
;(function(calcentralperf) {

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
;(function(calcentralperf) {

  'use strict';

  calcentralperf.controller('graphController', [
    '$http',
    '$scope',
    function(
      $http,
      $scope) {

    $scope.graph = 'test';

    var generateGrap = function(data) {
      var margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      //var parseDate = d3.time.format("%Y%m%d").parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.temperature); });

      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      // data.forEach(function(d) {
      //   d.date = parseDate(d.date);
      // });

      var cities = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, temperature: +d[name]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));

      y.domain([
        d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
        d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Temperature (ºF)");

      var city = svg.selectAll(".city")
          .data(cities)
        .enter().append("g")
          .attr("class", "city");

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

      city.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
    };

    angular.forEach($scope.info, function(info) {
      generateGrap(info);
    });
    //console.log($scope.info);
    //console.log($scope.info[0]);
    //console.log(d3);

  }]);

})(window.calcentralperf);
;(function(calcentralperf) {

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
