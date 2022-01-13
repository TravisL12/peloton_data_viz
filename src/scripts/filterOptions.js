import { attributes } from "./utils";

export const filterOptions = (sets) => {
  const filtersEl = document.getElementById("filters");
  const filterTypes = Object.keys(sets);

  filterTypes.forEach((filter) => {
    const el = document.createElement("div");
    el.className = "filter-option";
    const options = sets[filter].map((option) => `<li>${option}</li>`).join("");
    el.innerHTML = `
      <h3>${attributes[filter].title}</h3>
      <ul class="filters-list">${options}</ul>
    `;
    filtersEl.append(el);
  });
};
