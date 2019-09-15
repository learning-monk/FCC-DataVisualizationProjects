const width = 1200,
  height = 1000;

const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Converting string to dates
const myFormat = d3.timeParse("%Y");
const myTimeFormat = d3.timeParse("%M:%S");

// Converting dates to strings
const formatTime = d3.timeFormat("%Y-%m");
const formatYear = d3.timeFormat("%Y");
const MonthYear = d3.timeFormat("%b-%Y"); //eg: Feb-2007
const timeFormat = d3.timeFormat("%M:%S");

// Load data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(data => {
  data.forEach(d => {
    d.Time = myTimeFormat(d.Time);
    d.Name = d.Name;
    d.Year = myFormat(d.Year);
    d.Nationality = d.Nationality;
    d.Doping = d.Doping;
  });

  // const xValue = d => myFormat(d.Year);
  // const yValue = d => myTimeFormat(d.Time);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
    // .domain([0, d3.max(data, d => d.Year)])
    // .domain(d3.extent(data, d => d.Year))
    // .range([
    //   innerWidth / data.length / 2,
    //   innerWidth - innerWidth / data.length / 2
    // ])
    .range([0, innerWidth])
    .nice();
  const xAxis = d3.axisBottom(xScale);

  const yScale = d3
    .scalePoint()
    .domain(data.map(d => d.Time))
    // .range([innerHeight, 0])
    .range([0, innerHeight]) // flips the order of values
    .padding(0.8);

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  // Set fill color
  const cValue = d => d.Doping;
  // const circleColor = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mainG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const g = mainG
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", `translate(0,0)`);

  g.append("circle")
    .attr("class", "dot")
    .attr("cy", d => yScale(d.Time))
    .attr("cx", d => xScale(d.Year))
    .attr("r", 8)
    .attr("fill", d => (cValue(d) ? "red" : "green"))
    .on("mouseover", function(d) {
      //Get this bar's x/y values, then augment for the tooltip
      let xPosition = parseFloat(d3.select(this).attr("cx"));
      let yPosition = parseFloat(d3.select(this).attr("cy"));

      // Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#name")
        .text(d.Name);

      d3.select("#tooltip")
        .select("#nationality")
        .text(d.Nationality);

      d3.select("#tooltip")
        .select("#year")
        .text(formatYear(d.Year));

      d3.select("#tooltip")
        .select("#time")
        .text(timeFormat(d.Time));

      d3.select("#tooltip")
        .select("#doping")
        .text(d.Doping ? d.Doping : "No doping allegations");

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  // draw legend

  const legend = mainG
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (innerWidth - 110) + "," + 20 + ")")
    .selectAll("g")
    .data(["riders with doping allegations", "no doping allegations"])
    .enter()
    .append("g");

  // draw legend colored rectangles
  legend
    .append("rect")
    .attr("y", (d, i) => i * 30)
    // .attr("r", 5)
    .attr("height", 10)
    .attr("width", 10)
    .attr("fill", function(d) {
      if (d == "riders with doping allegations") {
        return "red";
      } else {
        return "green";
      }
    });

  // draw legend text
  legend
    .append("text")
    .attr("y", (d, i) => i * 30 + 9)
    .attr("x", 5 * 3)
    .text(d => d);

  mainG
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  mainG
    .append("text")
    .attr("class", "xAxis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 50)
    .text("Year")
    .attr("font-size", 18);

  mainG
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  mainG
    .append("text")
    .attr("class", "yAxis-label")
    .attr("x", -innerHeight / 2)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Time (fastest time on the top)")
    .attr("font-size", 18);

  mainG
    .append("text")
    .attr("class", "chart-title")
    .attr("y", -40)
    .attr("x", innerHeight / 2)
    .text("Doping in Professional Bicycle racing")
    // .attr("font-weight", "bold")
    .attr("font-family", "arial")
    .attr("font-size", 24);
});
