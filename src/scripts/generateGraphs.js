import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { barChartNames, lineChartNames } from "./utils";

export function generateGraphs(pelotonData) {
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
