import { buildBarChart } from "./barChart";

const chartNames = [
  { key: "instructor", title: "Instructor" },
  { key: "fitness_discipline", title: "Workout type" },
];

export function graphLinks(pelotonData) {
  const fileInputName = document.getElementById("file-name");
  const graphContainer = document.getElementById("graph");

  chartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      graphContainer.innerHTML = "";
      buildBarChart(pelotonData.count[key], title);
    });
    fileInputName.appendChild(item);
  });
}
