import * as d3 from "d3";

const mainWidth = 700;
const mainHeight = 300;

const margin = { top: 10, bottom: 120, left: 30, right: 10 };

const width = mainWidth - margin.left - margin.right;
const height = mainHeight - margin.top - margin.bottom;

export function buildChart(dataObject, title) {
  const data = Object.entries(dataObject).map(([name, count]) => ({
    name,
    count,
  }));

  data.sort((a, b) => d3.descending(a.count, b.count));

  const graphContainer = document.getElementById("graph");
  const innerContainer = document.createElement("div");
  innerContainer.innerHTML = `<h3>${title}</h3>`;

  const svg = d3
    .select(innerContainer)
    .append("svg")
    .attr("width", mainWidth)
    .attr("height", mainHeight)
    .append("g")
    .attr("class", "main")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("g").attr("class", "bars");

  const xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

  const yAxis = svg.append("g").attr("class", "y-axis");

  const xScale = d3.scaleBand().range([0, width]).padding(0.3);
  const yScale = d3.scaleLinear().range([height, 0]);

  xScale.domain(data.map(({ name }) => name));
  xAxis
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .text((d) => {
      return d;
    })
    .style("text-anchor", "end")
    .attr("transform", "rotate(-70) translate(-10,-10)");

  yScale.domain([0, d3.max(data.map(({ count }) => count)) * 1.1]);
  yAxis.transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(".bars")
    .selectAll(".bar")
    .data(data)
    .join((enter) => {
      const g = enter.append("g").attr("class", "bar");

      g.append("rect")
        .attr("x", (d) => xScale(d.name))
        .attr("y", (d) => yScale(d.count))
        .attr("height", (d) => height - yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("fill", "pink");

      return g;
    });

  graphContainer.appendChild(innerContainer);
}
