(function(calcentralperf) {

  'use strict';

  calcentralperf.controller('graphController', [
    '$http',
    '$scope',
    function(
      $http,
      $scope) {

    $scope.graph = 'test';

    var generateGraph = function(data, url) {
      var margin = {top: 20, right: 80, bottom: 50, left: 100},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.category20c();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.version); })
          .y(function(d) { return y(d.filesize); });

      setTimeout(function() {
        var svg = d3.select('div[data-id="' + url + '"]').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        color.domain(d3.keys(data[0].sizes));

        data.forEach(function(d) {
          var date = d.date.split('T').splice(0,1)[0].split('-');
          d.date = date.join('');
        });

        var sizes = color.domain().map(function(name) {

          return {
            name: name,
            values: data.map(function(d) {
              return {version: d.version, filesize: d.sizes[name].size/1024};
            })
          };
        });

        var legend = svg.append("svg")
            .attr("class", "legend")
            .attr("width", 70 * 2)
            .attr("height", 70 * 2)
            .attr("x", width - 20)
          .selectAll("g")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return d; });

        x.domain(d3.extent(data, function(d) { return d.version; }));

        y.domain([
          d3.min(sizes, function(c) { return d3.min(c.values, function(v) { return v.filesize; }); }),
          d3.max(sizes, function(c) { return d3.max(c.values, function(v) { return v.filesize; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("y", 40)
            .attr("dx", width/2)
            .text("Version");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("KiloBytes");

        var city = svg.selectAll(".city")
            .data(sizes)
          .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        /*city.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.version) + "," + y(d.value.filesize) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });*/
      }, 1000);
    };

    var data = [];
    $scope.graph = '';
    angular.forEach($scope.info, function(info) {
      data.push(info);
    });
    generateGraph(data, $scope.url);

  }]);

})(window.calcentralperf);
