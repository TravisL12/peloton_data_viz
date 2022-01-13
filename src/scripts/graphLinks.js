import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { attributes } from "./utils";

export const barChartNames = [
  attributes.instructor,
  attributes.fitness_discipline,
  attributes.length_minutes,
];

export const lineChartNames = [
  attributes.total_output,
  attributes.distance_miles,
  attributes.calories,
];

export function graphLinks(pelotonData) {
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
