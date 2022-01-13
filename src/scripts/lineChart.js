import * as d3 from "d3";
import { GROUP_SELECTOR, mainHeight, mainWidth } from "./chartConstants";
import { getSvg } from "./utils";

const margin = { top: 10, bottom: 50, left: 50, right: 10 };
const SVG_SELECTOR = "line-svg";

export function buildLineChart(data, title) {
  const { svg, width, height } = getSvg({
    selector: SVG_SELECTOR,
    margin,
    title,
  });
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().rangeRound([height, 0]);

  // update x-axis
  xScale.domain([
    0,
    d3.max(data, (d) => {
      return d.x;
    }),
  ]);
  d3.select(`.${SVG_SELECTOR} .x-axis`).call(d3.axisBottom(xScale));

  // update y-axis
  yScale.domain(d3.extent(data, (d) => d.y));
  d3.select(`.${SVG_SELECTOR} .y-axis`).transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(`.${SVG_SELECTOR} .${GROUP_SELECTOR}`)
    .selectAll(".line")
    .data([data]) // <---- wrap data in array!!!!
    .join(
      (enter) => {
        const g = enter.append("g").attr("class", "line");

        g.append("path")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke", "red")
          .attr("d", (dPath) =>
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })(dPath)
          );

        return g;
      },
      (update) => {
        update
          .select("path")
          .transition()
          .attr("d", (dPath) =>
            d3
              .line()
              .x((d) => {
                return xScale(d.x);
              })
              .y((d) => {
                return yScale(d.y);
              })(dPath)
          );
      }
    );
}
