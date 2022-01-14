import { generateGraphs } from "./generateGraphs";
import { attributes } from "./utils";
import PelotonData from "./PelotonData";

// SCENIC RIDES HAVE NO INSTRUCTOR!

export const filterOptions = (data) => {
  const pelotonData = new PelotonData();
  const parsedData = pelotonData.parseData(data);
  const sets = pelotonData.parseAttributeSets(parsedData);
  const filtersEl = document.getElementById("filters");
  const filterTypes = Object.keys(sets);
  const filterValues = Object.values(sets)
    .flat()
    .reduce((acc, set) => {
      acc[set] = true;
      return acc;
    }, {});

  generateGraphs(parsedData); // initialize graphs

  filterTypes.forEach((filter) => {
    const el = document.createElement("div");
    el.className = "filter-option";
    const options = sets[filter]
      .sort((a, b) => b - a)
      .map(
        (option) => `
      <li>
        <input type="checkbox" value="${option}" checked id='option-${option}' />
        <label for='option-${option}'>${option}</label>
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
      .addEventListener("change", (event) => {
        filterValues[event.target.value] = event.target.checked;
        console.log(filterValues);
        const filteredData = data.filter((d) => {
          return filterValues[d[filter]];
        });

        const parsed = pelotonData.parseData(filteredData);
        generateGraphs(parsed); // update graphs
      });

    // All One
    document
      .getElementById(`${filter}-all-btn`)
      .addEventListener("click", (event) => {
        console.log("hey", event);
      });

    // All Off
    document
      .getElementById(`${filter}-none-btn`)
      .addEventListener("click", (event) => {
        console.log("hey", event);
      });
  });
};
