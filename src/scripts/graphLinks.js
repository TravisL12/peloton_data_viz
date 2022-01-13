import { buildBarChart } from "./barChart";
import { graphLinksEl } from "./elementSelectors";
import { buildLineChart } from "./lineChart";

export const barChartNames = [
  { key: "instructor", title: "Instructor" },
  { key: "fitness_discipline", title: "Workout type" },
  { key: "length_minutes", title: "Length" },
];

export const lineChartNames = [
  { key: "total_output", title: "Output" },
  { key: "distance_miles", title: "Distance (mi.)" },
  { key: "calories", title: "Calories" },
];

export function graphLinks(pelotonData) {
  barChartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      buildBarChart(pelotonData.count[key], title);
    });
    graphLinksEl.appendChild(item);
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
    graphLinksEl.appendChild(item);
  });
}
