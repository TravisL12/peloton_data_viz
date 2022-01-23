import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import {
  mainWidth,
  mainHeight,
  GROUP_SELECTOR,
  barChartMargin,
} from "./constants";

const LineChart = ({ data, colors, currentGraph, select }) => {
  const svgRef = useRef(null);

  const width = mainWidth - barChartMargin.left - barChartMargin.right;
  const height = mainHeight - barChartMargin.top - barChartMargin.bottom;

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

    const allColors = colors[select.graphKey];
    const graphData = currentGraph.dataTransform(data, currentGraph.keys);
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    // update x-axis
    const min = d3.min(graphData, (d) => d3.min(d[1], (d) => d.x));
    const max = d3.max(graphData, (d) => d3.max(d[1], (d) => d.x));
    xScale.domain([min, max]);
    d3.select(`.x-axis`).call(
      d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")).ticks(20)
    );

    // update y-axis
    yScale.domain(d3.extent(graphData.map(([_, d]) => d).flat(), (d) => d.y));
    d3.select(`.y-axis`).transition().call(d3.axisLeft(yScale));

    svg
      .selectAll(`.${GROUP_SELECTOR}`)
      .selectAll(".line")
      .data(graphData, (d) => d[0])
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

    const circleData = graphData
      .map((d) => d[1].map((d1) => ({ ...d1, key: d[0] })))
      .flat();

    svg
      .selectAll(`.${GROUP_SELECTOR}`)
      .selectAll("circle")
      .data(circleData, (d) => `${d.key}-${d.y}-${d.x}`)
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("fill", "white")
            .attr("stroke", (d) => allColors(d.key))
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y))
            .attr("r", 2);

          return enter;
        },
        (update) => {
          update
            .transition()
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y));
        }
      );
  }, [colors, data, height, width, currentGraph, select]);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", mainWidth)
      .attr("height", mainHeight)
      .append("g")
      .attr("class", "main-group")
      .attr(
        "transform",
        `translate(${barChartMargin.left}, ${barChartMargin.top})`
      );

    svg.append("g").attr("class", GROUP_SELECTOR);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

    // create y-axis
    svg.append("g").attr("class", "y-axis");
  }, []);

  useEffect(() => {
    if (data?.length) {
      drawGraph();
    }
  }, [data, colors, drawGraph, select]);

  return <svg ref={svgRef} />;
};

export default LineChart;
