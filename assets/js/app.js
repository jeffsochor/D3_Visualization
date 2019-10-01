//OPEN HTML IN TERMINAL USE python -m SimpleHTTPServer

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(HWData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    HWData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(HWData, d => d.obesity)-1, d3.max(HWData, d => d.obesity)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(HWData, d => d.poverty)-1, d3.max(HWData, d => d.poverty)])
      .range([height, 0]);

   // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(HWData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .style("stroke", "black")  //Style vs Attr?
    .attr("fill", "green")
    .attr("opacity", ".35");

      // Text in Circles
    // ==============================  
    chartGroup.selectAll("text")
    .data(HWData)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.poverty))
    .style("font-size",".6em");

       // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("2014 Census Estimate - Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${(width / 2)}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("text-anchor", "middle")
      .text("2014 Census Estimate - Obesity");
  });
