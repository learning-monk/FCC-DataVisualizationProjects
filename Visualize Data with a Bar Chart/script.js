const width = 1200,
  height = 1000;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Converting string to dates
const myFormat = d3.timeParse("%Y-%m-%d");

// Converting dates to strings
const formatTime = d3.timeFormat("%Y-%m");
const formatYear = d3.timeFormat("%Y");
const MonthYear = d3.timeFormat("%b-%Y"); //eg: Feb-2007

// Load data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then(GDP => {
  GDP.data.forEach(d => {
    d[0] = myFormat(d[0]);
    d[1] = +d[1];
  });

  const xScale = d3
    .scaleTime()
    .domain([d3.min(GDP.data, d => d[0]), d3.max(GDP.data, d => d[0])])
    .range([
      innerWidth / GDP.data.length / 2,
      innerWidth - innerWidth / GDP.data.length / 2
    ]);

  const xAxis = d3.axisBottom().scale(xScale);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(GDP.data, d => d[1])])
    .range([innerHeight, 0]);

  const yAxis = d3.axisLeft().scale(yScale);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mainG = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const g = mainG
    .selectAll("g")
    .data(GDP.data)
    .enter()
    .append("g")
    .attr("transform", `translate(0,0)`);

  g.append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d[0]) - innerWidth / GDP.data.length / 2)
    .attr("y", d => yScale(d[1]))
    .attr("width", innerWidth / GDP.data.length / 2 + 1)
    .attr("height", d => innerHeight - yScale(d[1]))
    .attr("fill", "steelblue")
    .on("mouseover", function(d) {
      //Get this bar's x/y values, then augment for the tooltip
      let xPosition = parseFloat(d3.select(this).attr("x"));
      let yPosition = parseFloat(d3.select(this).attr("y"));

      // Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#year")
        .text(MonthYear(d[0]));

      d3.select("#tooltip")
        .select("#gdp")
        .text(Math.round(d[1]));

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  mainG
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  mainG
    .append("text")
    .attr("x", -100)
    .attr("y", 30)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Gross Domestic Product");

  mainG
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  mainG
    .append("text")
    .attr("id", "title")
    .attr("x", innerHeight / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("United States GDP by year");
});
