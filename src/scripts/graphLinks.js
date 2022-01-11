import { buildBarChart } from "./barChart";
import { graphContainer, graphLinksEl } from "./elementSelectors";

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
      graphContainer.innerHTML = "";
      buildBarChart(pelotonData.count[key], title);
    });
    graphLinksEl.appendChild(item);
  });
}
