import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { mainWidth, mainHeight, GROUP_SELECTOR, margin } from "../constants";
import { generateSvg, getUniq } from "../utils/utils";

const OverviewBarChart = ({ data, colors, currentGraph, select }) => {
  const svgRef = useRef(null);
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

    const allColors = colors[select.graphKey];
    const graphData = currentGraph.dataTransform(data, select.graphKey);

    // need object of each instructor with value associated
    // {date: 1234, leanne: 25.3, bill: 10, ...} this makes subgropus work
    const groups = graphData.map((d) => d.date);
    const stackGroup = getUniq(graphData.map((d) => d[select.graphKey]));
    const changedData = graphData.map((d) => {
      const output = stackGroup.reduce(
        (acc, key) => {
          acc[key] = 0;
          return acc;
        },
        { date: d.date }
      );
      output[d[select.graphKey]] = d.value;
      return output;
    });
    const stackedGen = d3.stack().keys(stackGroup)(changedData);
    const xScale = d3.scaleBand().range([0, width]).padding(0.3);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(groups);
    d3.select(`.x-axis`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-70) translate(-10,-10)");

    yScale.domain([0, d3.max(graphData.map(({ value }) => value)) * 1.1]);
    d3.select(`.y-axis`).transition().call(d3.axisLeft(yScale));

    svg
      .selectAll(`.${GROUP_SELECTOR}`)
      .selectAll(".bar")
      .data(stackedGen, (d) => d.date)
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "bar");

          g.append("rect")
            .attr("x", (d) => {
              console.log(d, "XXXXX");
              return xScale(d.data.date);
            })
            .attr("y", (d) => yScale(d[1]))
            .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr("fill", (d) => allColors(d[select.graphKey]));

          return g;
        },
        (update) => {
          update
            .select("rect")
            .transition()
            .attr("x", (d) => xScale(d.data.date))
            .attr("y", (d) => yScale(d[1]))
            .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("fill", (d) => allColors(d[select.graphKey]));
        },
        (exit) => {
          exit.transition().duration(250).style("opacity", 0).remove();
        }
      );
  }, [colors, data, height, width, currentGraph, select]);

  useEffect(() => {
    generateSvg(svgRef.current, height);
  }, [height]);

  useEffect(() => {
    if (data) {
      drawGraph();
    }
  }, [data, colors, drawGraph, select]);

  return <svg ref={svgRef} />;
};

export default OverviewBarChart;
