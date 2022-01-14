import { generateGraphs } from "./generateGraphs";
import { attributes } from "./utils";
import PelotonData from "./PelotonData";
import { graphLinks } from "./graphLinks";

// SCENIC RIDES HAVE NO INSTRUCTOR!

export const filterOptions = (rawData) => {
  graphLinks();
  const pelotonData = new PelotonData();
  const parsedData = pelotonData.parseData(rawData);
  const sets = pelotonData.parseAttributeSets(parsedData);

  const filtersEl = document.getElementById("filters");
  const filterTypes = Object.keys(sets);
  const filterValues = Object.values(sets)
    .flat()
    .reduce((acc, set) => {
      acc[set] = true;
      return acc;
    }, {});

  const submitOptions = () => {
    const filteredData = rawData.filter((d) => {
      return filterTypes.every((type) => filterValues[d[type]]);
    });

    const parsed = pelotonData.parseData(filteredData);
    generateGraphs(parsed);
  };

  const updateOptions = (event) => {
    filterValues[event.target.value] = event.target.checked;
    submitOptions();
  };

  const toggleAll = (filter, isChecked = false) => {
    sets[filter].forEach((attr) => {
      filterValues[attr] = isChecked;
      const optionEl = document.getElementById(`option-${attr}`);
      if (optionEl) {
        optionEl.checked = isChecked;
      }
    });
    submitOptions();
  };

  submitOptions();

  filterTypes.forEach((filter) => {
    const el = document.createElement("div");
    el.className = "filter-option";
    const options = sets[filter]
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
    filtersEl.append(el);

    // Check/Uncheck
    document
      .getElementById(`${filter}-form`)
      .addEventListener("change", updateOptions);

    // All One
    document
      .getElementById(`${filter}-all-btn`)
      .addEventListener("click", () => {
        toggleAll(filter, true);
      });

    // All Off
    document
      .getElementById(`${filter}-none-btn`)
      .addEventListener("click", () => {
        toggleAll(filter);
      });
  });
};
