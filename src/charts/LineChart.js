import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { mainWidth, mainHeight, GROUP_SELECTOR, margin } from "../constants";
import { attributes, generateSvg } from "../utils/utils";
import { dateFormat } from "../utils/graphLinks";

const LineChart = ({
  data,
  colors,
  currentGraph,
  keys,
  checkboxes,
  handleCheckboxChange,
}) => {
  const svgRef = useRef(null);

  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const drawGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);

    const allColors = colors.lines;
    const graphData = currentGraph.dataTransform(data, keys);
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    // update x-axis
    const min = d3.min(graphData, (d) => d3.min(d[1], (d) => d.x));
    const max = d3.max(graphData, (d) => d3.max(d[1], (d) => d.x));
    xScale.domain([min, max]);

    d3.select(`.x-axis`)
      .call(d3.axisBottom(xScale).tickFormat(dateFormat).ticks(20))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-70) translate(-10,-10)");

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
        },
        (exit) => {
          exit.select("path").transition().attr("stroke", "gray").remove();
          exit.transition().remove();
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
            .attr("fill", (d) => allColors(d.key))
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y))
            .attr("r", 3);

          return enter;
        },
        (update) => {
          update
            .transition()
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y));
        },
        (exit) => {
          exit.transition().attr("fill", "gray").remove();
        }
      );
  }, [colors, data, height, width, currentGraph, keys]);

  useEffect(() => {
    generateSvg(svgRef.current, height);
  }, []);

  useEffect(() => {
    if (data) {
      drawGraph();
    }
  }, [data, colors, drawGraph]);

  return (
    <>
      <div>
        {currentGraph?.keys.map((key) => {
          return (
            <div key={key} style={{ background: colors.lines(key) }}>
              <input
                onChange={handleCheckboxChange}
                type="checkbox"
                name={key}
                checked={checkboxes?.[key]}
                id={`compare-${key}`}
              />
              <label htmlFor={`compare-${key}`}>{attributes[key].title}</label>
            </div>
          );
        })}
      </div>
      <svg ref={svgRef} />
    </>
  );
};

export default LineChart;
