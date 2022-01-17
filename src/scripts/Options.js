import * as d3 from "d3";

import { attributes, chartNames } from "./utils";
import PelotonData from "./PelotonData";
import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { BAR_COUNT, LINE_CHART } from "./chartConstants";

// SCENIC RIDES HAVE NO INSTRUCTOR!

export class FilterOptions {
  constructor(rawData) {
    this.pelotonData = new PelotonData(rawData);
    this.pelotonData.parseData(rawData);
    this.filtersEl = document.getElementById("filters");
    this.filterTypes = Object.keys(this.pelotonData.sets);
    this.filterValues = Object.values(this.pelotonData.sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});
    this.graphLinks(this.pelotonData.data.parsed);
    this.init();

    // show one graph on load
    this.currentGraph = chartNames[0];
    this.updateGraph();
  }

  updateGraph() {
    const filteredData = this.pelotonData.data.original.filter((d) => {
      return this.filterTypes.every((type) => this.filterValues[d[type]]);
    });

    this.pelotonData.parseData(filteredData);

    if (this.currentGraph.type === BAR_COUNT) {
      const { key } = this.currentGraph;
      buildBarChart(this.pelotonData.data.count[key], key);
    } else if (this.currentGraph.type === LINE_CHART) {
      const { keys } = this.currentGraph;
      const data = keys.map((key) => {
        const d = this.pelotonData.data.parsed
          .filter((d) => +d[key])
          .map((d) => {
            const date = d3.timeParse("%Y-%m-%d %H:%M")(
              d.workout_date.slice(0, -6)
            );
            return { x: date, y: +d[key] };
          });
        return [key, d];
      });
      buildLineChart(data, this.currentGraph.key);
    }
  }

  toggleAll(filter, isChecked = false) {
    this.pelotonData.sets[filter].forEach((attr) => {
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
      const options = this.pelotonData.sets[filter]
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

      // All One
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
  }

  graphLinks() {
    const graphEl = document.createElement("ul");
    graphEl.id = "graph-links";
    const main = document.querySelector(".main");
    main.insertBefore(graphEl, main.firstChild);

    chartNames.forEach((chart) => {
      const item = document.createElement("li");
      item.classList = "options-item";
      item.textContent = chart.title;
      item.addEventListener("click", (event) => {
        // un-highlight all links
        [...document.getElementsByClassName("options-item")].forEach((li) => {
          li.classList.remove("selected");
        });
        // highlight clicked link
        event.target.classList.add("selected");

        this.currentGraph = chart;
        this.updateGraph();
      });
      graphEl.appendChild(item);
    });
  }
}
