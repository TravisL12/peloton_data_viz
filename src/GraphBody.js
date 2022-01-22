import * as d3 from "d3";
import { useEffect, useRef, useCallback } from "react";
import { parseItemCount } from "./parseUtils";

const GROUP_SELECTOR = "g-collection";
const mainWidth = 1000;
const mainHeight = 500;
const margin = { top: 10, bottom: 120, left: 40, right: 10 };

const countData = (dataParam, key) => {
  const count = parseItemCount(dataParam, key);
  const data = Object.entries(count).map(([name, count]) => ({
    name,
    count,
  }));
  data.sort((a, b) => d3.descending(a.count, b.count));
  return data;
};

const GraphBody = ({ data, colors }) => {
  const svgRef = useRef(null);
  const title = "Graph";
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  const drawGraph = useCallback(
    (graphKey = "instructor") => {
      const svg = d3.select(svgRef.current);

      const allColors = colors[graphKey];
      const graphData = countData(data, graphKey);
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
    },
    [colors, data, height, width]
  );

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
    if (data?.length) {
      drawGraph();
    }
  }, [data, colors, drawGraph]);

  return (
    <div className="main">
      <div id="graph">
        <div className="barchart-svg">
          <div>
            <h3>{title}</h3>
            <div>
              <div>
                {/* ${buildSelectMenu(`${selector}-select`, keys, "Category")}s */}
              </div>
            </div>
          </div>
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
  );
};

export default GraphBody;
