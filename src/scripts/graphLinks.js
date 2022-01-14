import { barChartNames, lineChartNames } from "./utils";

export const graphLinks = () => {
  const graphEl = document.createElement("ul");
  graphEl.id = "graph-links";
  const main = document.querySelector(".main");
  main.insertBefore(graphEl, main.firstChild);

  barChartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      document.getElementById(`${key}-id`)?.scrollIntoView();
    });
    graphEl.appendChild(item);
  });

  lineChartNames.forEach(({ key, title }) => {
    const item = document.createElement("li");
    item.textContent = title;
    item.addEventListener("click", () => {
      document.getElementById(`${key}-id`)?.scrollIntoView();
    });
    graphEl.appendChild(item);
  });
};
