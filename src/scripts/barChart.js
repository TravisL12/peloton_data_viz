import * as d3 from "d3";
import { getSvg } from "./utils";
import { GROUP_SELECTOR } from "./chartConstants";

const margin = { top: 10, bottom: 120, left: 40, right: 10 };
const SVG_SELECTOR = "barchart-svg";

export function barChart(data, keys, allColors, updateDataFn, title) {
  const { svg, selectMenu, width, height } = getSvg({
    selector: SVG_SELECTOR,
    keys,
    margin,
    title,
  });

  selectMenu.addEventListener("change", (event) => {
    buildGraph(event.target.value);
  });

  buildGraph(keys[0]);
  function buildGraph(graphKey) {
    const graphData = updateDataFn(data, graphKey);
    const xScale = d3.scaleBand().range([0, width]).padding(0.3);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(graphData.map(({ name }) => name));
    d3.select(`.${SVG_SELECTOR} .x-axis`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .text((d) => {
        return d;
      })
      .style("text-anchor", "end")
      .attr("transform", "rotate(-70) translate(-10,-10)");

    yScale.domain([0, d3.max(graphData.map(({ count }) => count)) * 1.1]);
    d3.select(`.${SVG_SELECTOR} .y-axis`)
      .transition()
      .call(d3.axisLeft(yScale));

    svg
      .selectAll(`.${SVG_SELECTOR} .${GROUP_SELECTOR}`)
      .selectAll(".bar")
      .data(graphData, (d) => d.name)
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
            .attr("fill", (d) => allColors(d.name));

          return g;
        },
        (update) => {
          update
            .select("rect")
            .transition()
            .attr("x", (d) => xScale(d.name))
            .attr("y", (d) => yScale(d.count))
            .attr("height", (d) => height - yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("fill", (d) => allColors(d.name));
        },
        (exit) => {
          exit.transition().duration(250).style("opacity", 0).remove();
        }
      );
  }
}
