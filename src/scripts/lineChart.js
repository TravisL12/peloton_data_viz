import * as d3 from "d3";
import { mainHeight, mainWidth } from "./chartConstants";
import { graphContainer } from "./elementSelectors";

const margin = { top: 10, bottom: 120, left: 30, right: 10 };

const width = mainWidth - margin.left - margin.right;
const height = mainHeight - margin.top - margin.bottom;

export function buildLineChart(data, title) {
  const innerContainer = document.createElement("div");
  innerContainer.innerHTML = `<h3>${title}</h3>`;

  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().rangeRound([height, 0]);

  const svg = d3
    .select(innerContainer)
    .attr("width", mainWidth)
    .attr("height", mainHeight)
    .append("g")
    .attr("class", "main")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("g").attr("class", "lines");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

  // create y-axis
  svg.append("g").attr("class", "y-axis");

  // update x-axis
  xScale.domain([
    0,
    d3.max(data, (d) => {
      return d.x;
    }),
  ]);
  svg.select(".x-axis").call(d3.axisBottom(xScale));

  // update y-axis
  yScale.domain(d3.extent(data.map(([_, d]) => d).flat(), (d) => d.y));
  svg.select(".y-axis").transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(".lines")
    .selectAll(".line")
    .data(data, (d) => d[0]) // <---- wrap data in array!!!!
    .join(
      (enter) => {
        const line = enter.append("g").attr("class", "line");

        return line
          .append("path")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke", "red")
          .attr("d", (dPath) => {
            return d3
              .line()
              .x((d) => xScale(d.x))
              .y((d) => {
                return yScale(d.y);
              })(dPath);
          });
      },
      (update) => {
        update
          .select("path")
          .transition()
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke", "red")
          .attr("d", (dPath) => {
            return d3
              .line()
              .x((d) => xScale(d.x))
              .y((d) => yScale(d.y))(dPath[1]);
          });
      }
    );

  graphContainer.appendChild(innerContainer);
}
