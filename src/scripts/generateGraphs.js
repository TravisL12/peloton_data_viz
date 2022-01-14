import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { barChartNames, lineChartNames } from "./utils";

export function generateGraphs(pelotonData) {
  const graphEl = document.createElement("ul");
  graphEl.id = "graph-links";
  const main = document.querySelector(".main");
  main.insertBefore(graphEl, main.firstChild);

  barChartNames.forEach(({ key }) => {
    buildBarChart(pelotonData.count[key], key);
  });

  lineChartNames.forEach(({ key }) => {
    const data = pelotonData.raw
      .filter((d) => +d[key])
      .map((d, i) => ({ x: i, y: +d[key] }));

    buildLineChart([["one", data]], key); // change "one" to key for multi-line graph
  });
}
