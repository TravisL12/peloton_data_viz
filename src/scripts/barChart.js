import * as d3 from "d3";
import { attributes, getSvg } from "./utils";
import { GROUP_SELECTOR } from "./chartConstants";

const margin = { top: 10, bottom: 120, left: 30, right: 10 };
const SVG_SELECTOR = "barchart-svg";

export function buildBarChart(dataObject, key) {
  const { title } = attributes[key];
  const data = Object.entries(dataObject).map(([name, count]) => ({
    name,
    count,
  }));

  data.sort((a, b) => d3.descending(a.count, b.count));

  const { svg, width, height } = getSvg({
    selector: SVG_SELECTOR,
    margin,
    key,
    title,
  });
  const xScale = d3.scaleBand().range([0, width]).padding(0.3);
  const yScale = d3.scaleLinear().range([height, 0]);

  xScale.domain(data.map(({ name }) => name));
  d3.select(`#${key}-id .x-axis`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .text((d) => {
      return d;
    })
    .style("text-anchor", "end")
    .attr("transform", "rotate(-70) translate(-10,-10)");

  yScale.domain([0, d3.max(data.map(({ count }) => count)) * 1.1]);
  d3.select(`#${key}-id .y-axis`).transition().call(d3.axisLeft(yScale));

  svg
    .selectAll(`#${key}-id .${GROUP_SELECTOR}`)
    .selectAll(".bar")
    .data(data, (d) => d.name)
    .join(
      (enter) => {
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
      },
      (update) => {
        update
          .select("rect")
          .transition()
          .attr("x", (d) => xScale(d.name))
          .attr("y", (d) => yScale(d.count))
          .attr("height", (d) => height - yScale(d.count))
          .attr("width", xScale.bandwidth());
      },
      (exit) => {
        exit.transition().duration(100).style("opacity", 0).remove();
      }
    );
}
