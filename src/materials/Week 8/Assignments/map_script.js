function buildMap(containerId) {

    var width = 1200;
    var height = 750;

    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    //console.log(innerWidth);
    //console.log(innerHeight);

    var svg = d3
              .select(containerId)
              .append("svg")
              .attr("width", width)
              .attr("height", height)

    var g = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

//read in data
    d3.json('us-states.json', function(error, geojson) {
      handleError(error, 'failed to read geoJSON data');

      d3.csv('stations.csv', function(error, stations){
        handleError(error, 'failed to read stations data');
        
          stations = prepDataStations(stations);

          draw(geojson, stations);
      });
    });
    



    function handleError(error, msg) {
      if (error) {
          console.error(msg);
      }
    }

    function prepDataStations(data) {
      return data
        .map(function(d) {
          return {
            name: d.STATION,
            type: +d.CLASS,
            elev: +d.elevation,
            loc: [+d.longitude, +d.latitude]
          };
        });
    }

    function draw(geojson, stations) {

      var sizeScale = d3
                  .scaleLinear()
                  .domain([d3.min(stations, function(d) {return d.elev;}), d3.max(stations, function(d) {return d.elev;})])
                  .range([2,15]);

      var colorScale = d3.scaleOrdinal()
                      .domain([1,2,3])
                      .range(["steelblue", "red", "orange"]);

      var myProjection = d3
          .geoAlbersUsa()
          //.geoMercator()
          .scale(1400)
          //.center([-120,55])
          .translate([innerWidth / 2, innerHeight / 2]);

      var geoPath = d3.geoPath().projection(myProjection);



      g
        .selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', geoPath)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', 0.5);


     /* g
        .selectAll('circle')
        .data(stations)
        .enter()
        .append('circle')
        .attr("class", "station")
        .attr('cx', function(d) {return myProjection(d.loc) === null ? null : myProjection(d.loc)[0];})
        .attr('cy', function(d) {return myProjection(d.loc) === null ? null :  myProjection(d.loc)[1];})
        .attr('r', function(d) {
        return sizeScale(d.elev);
        })
        .attr('fill', function(d) {
        return colorScale(d.type);
        })
        .attr('stroke', 'none');
*/
/*
      g
      .selectAll('.point-text')
      .data(stations)
      .enter()
      .append('text')
        .attr('class', 'point-text')
        .text(function(d){
          return d.name
        })
        .attr('x', function(d) {return myProjection(d.loc) === null ? null : myProjection(d.loc)[0];})
        .attr('y', function(d) {return myProjection(d.loc) === null ? null :  myProjection(d.loc)[1];})
        .style('font-size', "3px");
        */


    var filtered_stations = stations.map(function(station) {return station});
    var elev_stations = filtered_stations.map(function(station) {return station});
    //console.log(stations);
    //console.log(filtered_stations);

      update();
      elevUpdate;
      //alerty();

  d3.selectAll(".stat_cb").on("change", function() {
    var myType = this.value;
    if (this.checked) {
      var new_stations = stations.filter(function(station){ return station.type == myType;});
      //console.log(new_stations);
      filtered_stations = filtered_stations.concat(new_stations);
      //console.log("filtered" + filtered_stations);
    } else {
      filtered_stations = filtered_stations.filter(function(station){ return station.type != myType;});
    }
    console.log(filtered_stations);
    update();
  });


  d3.selectAll("#testButton").on("click", function () {
    maxElev = document.getElementById('elevation1').value;
    minElev = document.getElementById('elevation2').value;
    if ((isNaN(maxElev)) || (isNaN(minElev)))
      { numAlert(); }
      else
      {
    //elev_stations = filtered_stations.filter(function(station) {return station.elev >= minElev && station.elev <= maxElev});
    filtered_stations = filtered_stations.filter(function(station) {return station.elev >= minElev && station.elev <= maxElev});
    //filtered_stations = elev_stations;
    //console.log(elev_stations);
    //console.log(maxElev);
    //console.log(minElev);
    
    elevUpdate();
    } //replace this with your draw function
  });

  function numAlert() {
    alert("elevation must be a number!")
  }


  function elevUpdate() {
    var dot = g.selectAll(".circle")
    .data(filtered_stations, function(d){return d.station});

    dot.enter().append("circle").attr("class","circle")
                  .attr('r', 2)
                  //.attr('r', function(d) {return sizeScale(d.elev);})
                  .attr('fill', function(d) {return colorScale(d.type);})
                  .attr('cx', function(d) {return myProjection(d.loc) === null ? null : myProjection(d.loc)[0];})
                  .attr('cy', function(d) {return myProjection(d.loc) === null ? null :  myProjection(d.loc)[1];})
                  .transition()
                  .delay(0)
                  .duration(1000)
                  .attr('r', function(d) {return sizeScale(d.elev);});

    dot.exit()
    .transition()
    .duration(1000)
    .attr("cy", 900)
    .remove();
    //console.log(filtered_stations);
    //console.log(elev_stations);
    //console.log(maxElev);
    //console.log(minElev);
  }

   function update() {
    var dot = g.selectAll(".circle")
    .data(filtered_stations, function(d){return d.station});

    dot.enter().append("circle").attr("class","circle")
                  .attr('r', 2)
                  //.attr('r', function(d) {return sizeScale(d.elev);})
                  .attr('fill', function(d) {return colorScale(d.type);})
                  .attr('cx', function(d) {return myProjection(d.loc) === null ? null : myProjection(d.loc)[0];})
                  .attr('cy', function(d) {return myProjection(d.loc) === null ? null :  myProjection(d.loc)[1];})
                  .transition()
                  .delay(0)
                  .duration(1000)
                  .attr('r', function(d) {return sizeScale(d.elev);});

    dot.exit()
    .transition()
    .duration(1000)
    .attr("r", 0)
    .remove();
  }


  }
}

    buildMap('#map-holder');

