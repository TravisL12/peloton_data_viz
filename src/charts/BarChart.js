import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { mainWidth, mainHeight, GROUP_SELECTOR, margin } from "../constants";
import { generateSvg } from "../utils/utils";

const BarChart = ({ data, allColors, currentGraph, select }) => {
  const svgRef = useRef(null);
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

    const graphData = currentGraph.dataTransform(
      data,
      select.graphKey,
      select.secondKey
    );

    const xScale = d3.scaleBand().range([0, width]).padding(0.3);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(graphData.map((d) => d[select.graphKey]));
    d3.select(`.x-axis`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .text((d) => {
        return d;
      })
      .style("text-anchor", "end")
      .attr("transform", "rotate(-70) translate(-10,-10)");

    yScale.domain([0, d3.max(graphData.map(({ value }) => value)) * 1.1]);
    d3.select(`.y-axis`).transition().call(d3.axisLeft(yScale));

    svg
      .selectAll(`.${GROUP_SELECTOR}`)
      .selectAll(".bar")
      .data(graphData, (d) => d[select.graphKey])
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "bar");

          g.append("rect")
            .attr("x", (d) => xScale(d[select.graphKey]))
            .attr("y", (d) => yScale(d.value))
            .attr("height", (d) => height - yScale(d.value))
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
            .attr("x", (d) => xScale(d[select.graphKey]))
            .attr("y", (d) => yScale(d.value))
            .attr("height", (d) => height - yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("fill", (d) => allColors(d[select.graphKey]));
        },
        (exit) => {
          exit.transition().duration(250).style("opacity", 0).remove();
        }
      );
  }, [allColors, data, height, width, currentGraph, select]);

  useEffect(() => {
    generateSvg(svgRef.current, height);
  }, [height]);

  useEffect(() => {
    if (data) {
      drawGraph();
    }
  }, [data, allColors, drawGraph, select]);

  return <svg ref={svgRef} />;
};

export default BarChart;
