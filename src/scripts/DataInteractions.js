import * as d3 from "d3";

import { attributes } from "./utils";
import {
  parseItemCount,
  parseAttributeSets,
  parseHighlights,
} from "./parseUtilities";
import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { BAR_COUNT, LINE_CHART } from "./chartConstants";
import { chartNames } from "./graphFunctions";

// SCENIC RIDES HAVE NO INSTRUCTOR!

const graphLinks = (interactions) => {
  const graphEl = document.createElement("ul");
  graphEl.id = "graph-links";
  const main = document.querySelector(".main");
  main.insertBefore(graphEl, main.firstChild);

  chartNames.forEach((chart) => {
    const item = document.createElement("li");
    item.classList = "options-item";
    item.textContent = chart.title;
    item.addEventListener("click", (event) => {
      [...document.getElementsByClassName("options-item")].forEach((li) => {
        li.classList.remove("selected");
      });
      event.target.classList.add("selected");
      interactions.currentGraph = chart;
      interactions.updateGraph();
    });
    graphEl.appendChild(item);
  });
};

export class DataInteractions {
  constructor(originalData) {
    this.originalData = originalData;
    this.filtersEl = document.getElementById("filters");
    this.sets = parseAttributeSets(originalData);
    this.highlights = parseHighlights(originalData, this.sets);
    this.filterTypes = Object.keys(this.sets);
    this.filterValues = Object.values(this.sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});

    graphLinks(this);
    this.init();
  }

  updateGraph() {
    const filteredData = this.originalData.filter((d) => {
      return this.filterTypes.every((type) => this.filterValues[d[type]]);
    });
    this.currentGraph.chartFn(filteredData, this.currentGraph);
  }

  toggleAll(filter, isChecked = false) {
    this.sets[filter].forEach((attr) => {
      this.filterValues[attr] = isChecked;
      const optionEl = document.getElementById(`option-${attr}`);
      if (optionEl) {
        optionEl.checked = isChecked;
      }
    });
    this.updateGraph();
  }

  init() {
    this.filterTypes.forEach((filter) => {
      const el = document.createElement("div");
      el.className = "filter-option";
      const options = this.sets[filter]
        .sort((a, b) => b - a)
        .map(
          (option) => `
      <li>
        <input type="checkbox" value="${option}" checked id="option-${option}" />
        <label for="option-${option}">${option}</label>
      </li>
    `
        )
        .join("");

      el.innerHTML = `
      <h3>${attributes[filter].title}</h3>
      <div>
        <button id="${filter}-all-btn">All</button>
        <button id="${filter}-none-btn">None</button>
      </div>
      <form id="${filter}-form">
        <ul class="filters-list">
          ${options}
        </ul>
      </form>
    `;
      this.filtersEl.append(el);

      // Check/Uncheck
      document
        .getElementById(`${filter}-form`)
        .addEventListener("change", (event) => {
          this.filterValues[event.target.value] = event.target.checked;
          this.updateGraph();
        });

      // All On
      document
        .getElementById(`${filter}-all-btn`)
        .addEventListener("click", () => {
          this.toggleAll(filter, true);
        });

      // All Off
      document
        .getElementById(`${filter}-none-btn`)
        .addEventListener("click", () => {
          this.toggleAll(filter);
        });
    });

    this.currentGraph = chartNames[0];
    this.updateGraph();
  }
}
