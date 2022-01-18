import * as d3 from "d3";

import { attributes, chartNames } from "./utils";
import { dataHelper } from "./parseUtilities";
import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";
import { BAR_COUNT, LINE_CHART, BAR_CHART } from "./chartConstants";
import { buildBarAllChart } from "./barAllChart";

// SCENIC RIDES HAVE NO INSTRUCTOR!

const helper = dataHelper();

export class DataInteractions {
  constructor(originalData) {
    this.originalData = originalData;
    this.filtersEl = document.getElementById("filters");
    this.sets = helper.parseAttributeSets(originalData);
    this.highlights = helper.parseHighlights(originalData, this.sets);
    this.filterTypes = Object.keys(this.sets);
    this.filterValues = Object.values(this.sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});
    this.init();

    // show one graph on load
    this.currentGraph = chartNames[0];
    this.updateGraph();
  }

  updateGraph() {
    const filteredData = this.originalData.filter((d) => {
      return this.filterTypes.every((type) => this.filterValues[d[type]]);
    });

    const { key, keys, title } = this.currentGraph;

    if (this.currentGraph.type === BAR_CHART) {
      buildBarAllChart(this.originalData, key);
    } else if (this.currentGraph.type === BAR_COUNT) {
      const countData = helper.parseItemCount(filteredData, key);
      const data = Object.entries(countData).map(([name, count]) => ({
        name,
        count,
      }));
      data.sort((a, b) => d3.descending(a.count, b.count));
      buildBarChart(data, key, title);
    } else if (this.currentGraph.type === LINE_CHART) {
      const data = keys.map((key) => {
        const d = filteredData
          .filter((d) => +d[key])
          .map((d) => {
            const date = d3.timeParse("%Y-%m-%d %H:%M")(
              d.workout_date.slice(0, -6)
            );
            return { x: date, y: +d[key] };
          });
        return [key, d];
      });
      buildLineChart(data, key, title);
    }
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
    this.graphLinks();
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
