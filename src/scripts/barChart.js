import * as d3 from "d3";

export function buildChart(data) {
  const graphContainer = document.getElementById("graph");
  d3.select(graphContainer)
    .append("svg")
    .attr("class", "bar-chart")
    .attr("width", 700)
    .attr("height", 400)
    .style("background", "pink");
}
