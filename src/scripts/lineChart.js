import * as d3 from "d3";
import { mainHeight, mainWidth } from "./chartConstants";
import { graphContainer } from "./elementSelectors";

const margin = { top: 10, bottom: 50, left: 50, right: 10 };

const width = mainWidth - margin.left - margin.right;
const height = mainHeight - margin.top - margin.bottom;

export function buildLineChart(data, title) {
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().rangeRound([height, 0]);
  let svg;

  if (document.getElementsByClassName("line-svg").length) {
    svg = d3.select(".line-svg");
  } else {
    const innerContainer = document.createElement("div");
    innerContainer.innerHTML = `<h3>${title}</h3>`;
    svg = d3
      .select(innerContainer)
      .append("svg")
      .attr("class", "line-svg")
      .attr("width", mainWidth)
      .attr("height", mainHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g").attr("class", "lines");

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

    // create y-axis
    svg.append("g").attr("class", "y-axis");
    graphContainer.appendChild(innerContainer);
  }

  // update x-axis
  xScale.domain([
    0,
    d3.max(data, (d) => {
      return d.x;
    }),
  ]);
  d3.select(".x-axis").call(d3.axisBottom(xScale));

  // update y-axis
  yScale.domain(d3.extent(data, (d) => d.y));
  d3.select(".y-axis").transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(".lines")
    .selectAll(".line")
    .data([data]) // <---- wrap data in array!!!!
    .join(
      (enter) => {
        const g = enter.append("g").attr("class", "line");

        g.append("path")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke", "red")
          .attr(
            "d",
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })
          );

        return g;
      },
      (update) => {
        update
          .select("path")
          .transition()
          .attr(
            "d",
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })
          );
      }
    );
}
