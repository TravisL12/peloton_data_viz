import * as d3 from "d3";

import {
  attributes,
  INSTRUCTOR,
  FITNESS_DISCIPLINE,
  LENGTH_MINUTES,
  TYPE,
  SPEED_AVG,
  DISTANCE_MILES,
  CALORIES,
  CADENCE_AVG,
  RESISTANCE_AVG,
  TOTAL_OUTPUT,
} from "./utils";
import { parseAttributeSets, parseHighlights } from "./parseUtilities";
import { chartNames } from "./graphFunctions";

// SCENIC RIDES HAVE NO INSTRUCTOR!

const schemes = {
  [INSTRUCTOR]: d3.schemeCategory10,
  [FITNESS_DISCIPLINE]: d3.schemeDark2,
  [LENGTH_MINUTES]: d3.schemePastel1,
  [TYPE]: d3.schemePastel2,
  [SPEED_AVG]: d3.schemePastel1,
  [DISTANCE_MILES]: d3.schemePastel1,
  [CALORIES]: d3.schemePastel1,
  [CADENCE_AVG]: d3.schemePastel1,
  [RESISTANCE_AVG]: d3.schemePastel1,
  [TOTAL_OUTPUT]: d3.schemePastel1,
};

const getColor = (key, domainExtent) => {
  return d3.scaleOrdinal(schemes[key]).domain(domainExtent);
};

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
    const { key, keys } = this.currentGraph;
    const colors = getColor(key, keys || this.sets[key]);
    this.currentGraph.chartFn(filteredData, this.currentGraph, colors);
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
        .map((option) => {
          const colors = getColor(filter, this.sets[filter]);
          return `
      <li>
        <input type="checkbox" value="${option}" checked id="option-${option}" />
        <label for="option-${option}" style="background: ${colors(
            option
          )};">${option}</label>
      </li>
    `;
        })
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
