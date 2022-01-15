import { attributes, chartNames } from "./utils";
import PelotonData from "./PelotonData";
import { buildBarChart } from "./barChart";
import { buildLineChart } from "./lineChart";

// SCENIC RIDES HAVE NO INSTRUCTOR!

export class FilterOptions {
  constructor(rawData) {
    this.pelotonData = new PelotonData();
    this.rawData = rawData;
    const parsedData = this.pelotonData.parseData(rawData);

    this.sets = this.pelotonData.parseAttributeSets(parsedData);
    this.filtersEl = document.getElementById("filters");
    this.filterTypes = Object.keys(this.sets);
    this.filterValues = Object.values(this.sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});
    this.graphLinks(parsedData);
    this.init();

    // show one graph on load
    this.currentGraph = chartNames[0];
    this.updateGraph();
  }

  updateGraph() {
    const filteredData = this.rawData.filter((d) => {
      return this.filterTypes.every((type) => this.filterValues[d[type]]);
    });

    const parsed = this.pelotonData.parseData(filteredData);
    const { type } = this.currentGraph;
    if (type === "bar") {
      const { key } = this.currentGraph;
      buildBarChart(parsed.count[key], key);
    } else if (type === "line") {
      const { keys } = this.currentGraph;
      const data = keys.map((key) => {
        const d = parsed.raw
          .filter((d) => +d[key])
          .map((d, i) => ({ x: i, y: +d[key] }));
        return [key, d];
      });
      console.log(data);
      buildLineChart(data, this.currentGraph.key);
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

      // All One
      document
        .getElementById(`${filter}-all-btn`)
        .addEventListener("click", () => {
          this.toggleAll(filter, true);
          console.log("d");
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
        // highlight selected graph
        [...document.getElementsByClassName("options-item")].forEach((li) => {
          li.classList.remove("selected");
        });
        event.target.classList.add("selected");

        this.currentGraph = chart;
        this.updateGraph();
      });
      graphEl.appendChild(item);
    });
  }
}
