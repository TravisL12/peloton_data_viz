import { buildBarChart } from "./barChart";
import { filterOptions } from "./filterOptions";
import { buildLineChart } from "./lineChart";
import { barChartNames, lineChartNames } from "./utils";

export function graphLinks(pelotonData) {
  filterOptions(pelotonData.sets);

  const graphEl = document.createElement("ul");
  graphEl.id = "graph-links";
  const main = document.querySelector(".main");
  main.insertBefore(graphEl, main.firstChild);

  barChartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      buildBarChart(pelotonData.count[key], title);
    });
    graphEl.appendChild(item);
  });

  lineChartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      const data = pelotonData.raw
        .filter((d) => +d[key])
        .map((d, i) => ({ x: i, y: +d[key] }));

      buildLineChart([["one", data]], title); // change "one" to key for multi-line graph
    });
    graphEl.appendChild(item);
  });
}
