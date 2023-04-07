import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { mainWidth, mainHeight, GROUP_SELECTOR, margin } from "../constants";
import { generateSvg, getUniq } from "../utils/utils";

const OverviewBarChart = ({ data, colors, currentGraph, select }) => {
  const svgRef = useRef(null);
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const allColors = colors[select.graphKey];
  const xScale = d3.scaleBand().range([0, width]).padding(0.3);
  const yScale = d3.scaleLinear().range([height, 0]);

  const graphData = currentGraph.dataTransform(
    data,
    select.graphKey,
    select.secondKey
  );
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

  const updateBars = useCallback(
    (selection) => {
      return selection
        .selectAll("rect")
        .data((d) => d)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("x", (d) => xScale(d.data.date))
              .attr("y", (d) => yScale(d[1]))
              .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
              .attr("width", xScale.bandwidth()),
          (update) => {
            update
              .transition()
              .attr("x", (d) => xScale(d.data.date))
              .attr("y", (d) => yScale(d[1]))
              .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
              .attr("width", xScale.bandwidth());
          }
        );
    },
    [xScale, yScale]
  );

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

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

          g.append("g")
            .attr("class", "bars")
            .attr("fill", (d) => allColors(d.key))
            .attr("stroke-width", 1)
            .attr("stroke", "black");

          updateBars(g.select(".bars"));
          return g;
        },
        (update) => {
          updateBars(update.select(".bars"));
        },
        (exit) => {
          exit.transition().style("opacity", 0).remove();
        }
      );
  }, [allColors, graphData, groups, stackedGen, updateBars, xScale, yScale]);

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
