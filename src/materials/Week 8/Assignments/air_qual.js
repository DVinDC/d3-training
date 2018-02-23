function buildViz(containerId) {

d3.csv("air_quality.csv", function(data){
        //console.log(data);

    var width = 1300;
    var height = 700;

    var margin = {
      top: 100,
      right: 50,
      bottom: 50,
      left: 100
    };

    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

    var g = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');


    data.forEach(function(d) {d.Emissions = +d.Emissions;}); 


//Construct scales
    var yScale = d3
                  .scaleLinear()
                  .domain([0, d3.max(data, function(d) {return d.Emissions;})])
                  .range([innerHeight, 0]);                  
    
    var x = d3
                  .scaleBand()
                  .domain(data.map(function(d) {return d.State;}))
                  .range([0, innerWidth])
                  .padding(0.2);

//console.log(xScale.domain(), xScale.range());

  /*
  data.sort(function(a, b) {
    return b.Emissions - a.Emissions;
  });
  console.log(data);
  */

//Construct axes and axis text
    var xAxis = d3.axisBottom(x);
    g.append('g')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .attr("class", "x axis")
      .call(xAxis);

    var yAxis = d3.axisLeft(yScale);

    g
      .append('g')
      .call(yAxis);


//Add gridlines
    function make_y_gridlines() {   
            return d3.axisLeft(yScale)
      };

      g.append("g")     
        .attr("class", "grid")
        .attr("y", 120)
        .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      );

    g
      .append('text')
      .attr('x', innerWidth/2)
      .attr('y', innerHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('State')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('font-size', '15px');

    g
      .append('text')
      .attr('x', innerWidth/2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('font-family', 'sans-serif')
      .style('font-size', '25px')
      .attr('font-weight', 'bold')
      .text('Emissions by State');


    g
      .append('text')
      .attr('x', -20)
      .attr('y', 250)
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
      .style('font-size', 14)
      .text('Total Emissions');


//Define colors for Regions
    var colorScale = d3.scaleOrdinal()
                      .domain(["West", "South", "Northeast", "Midwest"])
                      .range(["steelblue", "#091A2E", "#ff9900", "#800000"]);

//Add rectangles for bar chart
    var rects = g.selectAll("rect")
                .data(data)
                .enter()
                  .append("rect")
                  .attr("height", function(d) {return innerHeight - yScale(d.Emissions);})
                  .attr("width", 20)
                  .attr("x", function(d, i){return x(d.State);})
                  .attr("y", function(d){return yScale(d.Emissions);})
                  .attr("fill", function(d) {return colorScale(d.Region)})
                  .attr("class", "bar");

//add colored boxes for Region legend
    g.
      append("rect")
      .attr('x', 60)
      .attr('y', -10)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", "steelblue");

    g.
      append("rect")
      .attr('x', 60)
      .attr('y', 15)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", "#091A2E");

    g.
      append("rect")
      .attr('x', 60)
      .attr('y', 40)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", "#ff9900");

    g.
      append("rect")
      .attr('x', 60)
      .attr('y', 65)
      .attr("height", 20)
      .attr("width", 20)
      .attr("fill", "#800000");

//add text for Region Legend
    g.
      append("text")
      .attr('x', 85)
      .attr('y', 5)
      .attr('font-family', 'sans-serif')
      .style('font-size', '15px')
      .text('West');

    g.
      append("text")
      .attr('x', 85)
      .attr('y', 30)
      .attr('font-family', 'sans-serif')
      .style('font-size', '15px')
      .text('South');

    g.
      append("text")
      .attr('x', 85)
      .attr('y', 55)
      .attr('font-family', 'sans-serif')
      .style('font-size', '15px')
      .text('Northeast');

    g.
      append("text")
      .attr('x', 85)
      .attr('y', 80)
      .attr('font-family', 'sans-serif')
      .style('font-size', '15px')
      .text('Midwest');

    g.
      append("text")
      .attr('x', 85)
      .attr('y', -20)
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .style('font-size', '16px')
      .text('Regions');





  //d3.select("input[name='sort']").on("change", change);

  //var sortTimeout = setTimeout(function() {
  //  d3.select("input").property("checked", true).each(change);
  //}, 2000);
/* OLD ATTEMPT
  function change() {

    //clearTimeout(sortTimeout);

    var x0 = x.domain(data.sort(this.value == "state" ?
        (function(a, b) { 
          return d3.ascending(a.State, b.State); 
        }) : ((this.value == "emisdesc") ?
          (function(a, b) {
              return b.Emissions - a.Emissions;
            }) : (function(a, b) {
              return a.Emissions - b.Emissions;
            })))
      .map(function(d) {
          return d.State;
        })
    )  
        .copy();

    svg.selectAll("rect")
        .sort(function(a, b) { 
          return x0(a.State) - x0(b.State); 
    });

    var transition = svg.transition().duration(750);
        
    delay = function(d, i) { return i * 50; };

    transition.selectAll("rect")
        .delay(delay)
        .attr("x", function(d) {
          return x0(d.State); 
      });

    transition.select(".x axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
*/
  
    function submit() {
      var userTime = document.getElementById('time').value;
      //console.log(userTime);
    }

//submit();




    d3.selectAll("input[name='stack']").on("change", change);
    


    function change() {

    var userTime = document.getElementById('time').value;
      console.log(userTime);

      if (isNaN(userTime))
    {
      alert("Delay must be a number!")
    }
    else
    {
      //submit();
      var x0 = x.domain(data.sort(this.value == "val1" ?
          (function(a, b) {
            return d3.ascending(a.State, b.State)
            ;
          }) : ((this.value == "val2") ?
            (function(a, b) {
              return b.Emissions - a.Emissions;
            }) : (function(a, b) {
              return a.Emissions - b.Emissions;
            }))).map(function(d) {
          return d.State;
        }))
        .copy();

      svg.selectAll(".bar")
        .sort(function(a, b) {
          return x0(a.State) - x0(b.State);
        });

      var transition = svg.transition().duration(750),
        delay = function(d, i) {
          return i * userTime;
        };

      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) {
          return x0(d.State);
        });

      transition.select(".x.axis")
        .call(xAxis)
        .selectAll("g")
        .delay(delay);
    }
  
}
  //console.log("test")

});

}

buildViz();


//.attr("x", function(d){return xScale(d.State);})