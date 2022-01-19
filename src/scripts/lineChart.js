import * as d3 from "d3";
import { GROUP_SELECTOR } from "./chartConstants";
import { allColors, getSvg } from "./utils";

const margin = { top: 10, bottom: 50, left: 50, right: 10 };
const SVG_SELECTOR = "line-svg";

export function lineChart(data, title) {
  const { svg, width, height } = getSvg({
    selector: SVG_SELECTOR,
    margin,
    title,
  });
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().rangeRound([height, 0]);
  allColors.domain(data.map((d) => d[0]));

  // update x-axis
  const min = d3.min(data, (d) => d3.min(d[1], (d) => d.x));
  const max = d3.max(data, (d) => d3.max(d[1], (d) => d.x));
  xScale.domain([min, max]);
  d3.select(`.${SVG_SELECTOR} .x-axis`).call(
    d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")).ticks(20)
  );

  // update y-axis
  yScale.domain(d3.extent(data.map(([_, d]) => d).flat(), (d) => d.y));
  d3.select(`.${SVG_SELECTOR} .y-axis`).transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(`.${SVG_SELECTOR} .${GROUP_SELECTOR}`)
    .selectAll(".line")
    .data(data, (d) => d[0])
    .join(
      (enter) => {
        const g = enter.append("g").attr("class", "line");

        g.append("path")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke", (d) => allColors(d[0]))
          .attr("d", (dPath) =>
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })(dPath[1])
          );

        return g;
      },
      (update) => {
        update
          .select("path")
          .transition()
          .attr("stroke", (d) => allColors(d[0]))
          .attr("d", (dPath) =>
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })(dPath[1])
          );
      }
    );
}
