import { attributes } from "./utils";

export const filterOptions = (sets) => {
  const filtersEl = document.getElementById("filters");
  const filterTypes = Object.keys(sets);

  filterTypes.forEach((filter) => {
    const el = document.createElement("div");
    el.className = "filter-option";
    const options = sets[filter]
      .sort((a, b) => b - a)
      .map(
        (option) => `
      <li>
        <input type="checkbox" checked id='option-${option}' />
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
    document
      .getElementById(`${filter}-form`)
      .addEventListener("change", (event) => {
        console.log("hey", event);
      });

    document
      .getElementById(`${filter}-all-btn`)
      .addEventListener("click", (event) => {
        console.log("hey", event);
      });

    document
      .getElementById(`${filter}-none-btn`)
      .addEventListener("click", (event) => {
        console.log("hey", event);
      });
  });
};
