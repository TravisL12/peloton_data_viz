import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { mainWidth, mainHeight, GROUP_SELECTOR, margin } from "./constants";
import RadioInput from "./RadioInput";

const BarChart = ({
  data,
  colors,
  currentGraph,
  select,
  handleSelectChange,
}) => {
  const svgRef = useRef(null);
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

    const allColors = colors[select.graphKey];
    const graphData = currentGraph.dataTransform(
      data,
      select.graphKey,
      select.secondKey
    );
    console.log(graphData);
    const xScale = d3.scaleBand().range([0, width]).padding(0.3);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(graphData.map(({ name }) => name));
    d3.select(`.x-axis`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .text((d) => {
        return d;
      })
      .style("text-anchor", "end")
      .attr("transform", "rotate(-70) translate(-10,-10)");

    yScale.domain([0, d3.max(graphData.map(({ count }) => count)) * 1.1]);
    d3.select(`.y-axis`).transition().call(d3.axisLeft(yScale));

    svg
      .selectAll(`.${GROUP_SELECTOR}`)
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
  }, [colors, data, height, width, currentGraph, select]);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", mainWidth)
      .attr("height", mainHeight)
      .append("g")
      .attr("class", "main-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g").attr("class", GROUP_SELECTOR);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

    // create y-axis
    svg.append("g").attr("class", "y-axis");
  }, []);

  useEffect(() => {
    if (data) {
      drawGraph();
    }
  }, [data, colors, drawGraph, select]);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <RadioInput
          selectKey={"graphKey"}
          label={"Category"}
          keys={currentGraph?.keys}
          value={select.graphKey}
          handleSelectChange={handleSelectChange}
        />
        {currentGraph?.secondKeys && (
          <RadioInput
            selectKey={"secondKey"}
            label={"Value"}
            keys={currentGraph?.secondKeys}
            value={select.secondKey}
            handleSelectChange={handleSelectChange}
          />
        )}
      </div>
      <svg ref={svgRef} />
    </>
  );
};

export default BarChart;
