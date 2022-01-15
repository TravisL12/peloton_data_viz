import { generateGraphs } from "./generateGraphs";
import { attributes } from "./utils";
import PelotonData from "./PelotonData";
import { graphLinks } from "./graphLinks";

// SCENIC RIDES HAVE NO INSTRUCTOR!

export class FilterOptions {
  constructor(rawData) {
    graphLinks();
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
    this.submitOptions();
    this.init();
  }

  submitOptions() {
    const filteredData = this.rawData.filter((d) => {
      return this.filterTypes.every((type) => this.filterValues[d[type]]);
    });

    const parsed = this.pelotonData.parseData(filteredData);
    generateGraphs(parsed);
  }

  updateOptions(event) {
    this.filterValues[event.target.value] = event.target.checked;
    this.submitOptions();
  }

  toggleAll(filter, isChecked = false) {
    this.sets[filter].forEach((attr) => {
      this.filterValues[attr] = isChecked;
      const optionEl = document.getElementById(`option-${attr}`);
      if (optionEl) {
        optionEl.checked = isChecked;
      }
    });
    this.submitOptions();
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
        .addEventListener("change", this.updateOptions.bind(this));

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
}
