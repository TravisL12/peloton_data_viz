import * as d3 from "d3";
import { graphContainer } from "./elementSelectors";
import { GROUP_SELECTOR, mainHeight, mainWidth } from "./chartConstants";
import { select } from "d3";

export const CADENCE_AVG = "cadence_avg";
export const HEARTRATE_AVG = "heartrate_avg";
export const INCLINE_AVG = "incline_avg";
export const PACE_AVG = "pace_avg";
export const RESISTANCE_AVG = "resistance_avg";
export const SPEED_AVG = "speed_avg";
export const WATTS_AVG = "watts_avg";
export const CALORIES = "calories";
export const CLASS_DATE = "class_date";
export const DISTANCE_MILES = "distance_miles";
export const FITNESS_DISCIPLINE = "fitness_discipline";
export const INSTRUCTOR = "instructor";
export const LENGTH_MINUTES = "length_minutes";
export const LIVE_ONDEMAND = "live_ondemand";
export const TITLE = "title";
export const TOTAL_OUTPUT = "total_output";
export const TYPE = "type";
export const WORKOUT_DATE = "workout_date";

export const keys = {
  "Avg. Cadence (RPM)": CADENCE_AVG,
  "Avg. Heartrate": HEARTRATE_AVG,
  "Avg. Incline": INCLINE_AVG,
  "Avg. Pace (min/mi)": PACE_AVG,
  "Avg. Resistance": RESISTANCE_AVG,
  "Avg. Speed (mph)": SPEED_AVG,
  "Avg. Watts": WATTS_AVG,
  "Calories Burned": CALORIES,
  "Class Timestamp": CLASS_DATE,
  "Distance (mi)": DISTANCE_MILES,
  "Fitness Discipline": FITNESS_DISCIPLINE,
  "Instructor Name": INSTRUCTOR,
  "Length (minutes)": LENGTH_MINUTES,
  "Live/On-Demand": LIVE_ONDEMAND,
  Title: TITLE,
  "Total Output": TOTAL_OUTPUT,
  Type: TYPE,
  "Workout Timestamp": WORKOUT_DATE,
};

export const attributes = Object.keys(keys).reduce((acc, title) => {
  const key = keys[title];
  acc[key] = { key, title };
  return acc;
}, {});

export const getUniq = (data) => {
  return [...new Set(data)];
};

export const getSvg = ({ selector, keys, secondKeys, margin, title }) => {
  let svg;
  let selectMenu;
  let secondSelectMenu;
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  if (document.querySelector(`.${selector}`)) {
    document.querySelector(`.${selector} h3`).textContent = title;
    svg = d3.select(`.${selector} .main-group`);
    selectMenu = document.querySelector(`.${selector} #${selector}-select`);
    secondSelectMenu = document.querySelector(
      `.${selector} #${selector}-select-second`
    );

    if (!secondKeys) {
      document.querySelector(`.${selector}-select-second`).remove();
    }
    if (!secondSelectMenu) {
      const secondKeysMenu = `<div class="${selector}-select-second">
      <label>Value</label>
            <select name="${selector}-select-second" id="${selector}-select-second">
            ${secondKeys
              ?.map(
                (key, i) =>
                  `<option ${
                    i === 0 ? "selected" : ""
                  } value="${key}">${key}</option>`
              )
              .join("")}
            </select>
            </div>`;

      selectMenu.insertAdjacentHTML("afterend", secondKeysMenu);
    }
  } else {
    graphContainer.innerHTML = "";
    const innerContainer = document.createElement("div");
    innerContainer.className = selector;
    const secondKeysMenu = secondKeys
      ? `<div class="${selector}-select-second">
            <label>Value</label>
            <select name="${selector}-select-second" id="${selector}-select-second">
            ${secondKeys
              ?.map(
                (key, i) =>
                  `<option ${
                    i === 0 ? "selected" : ""
                  } value="${key}">${key}</option>`
              )
              .join("")}
            </select>
            </div>`
      : ``;

    innerContainer.innerHTML = `
        <div>
          <h3>${title}</h3>
          <div>
            <div>
              <label>Category</label>
              <select name="${selector}-select" id="${selector}-select">
              ${keys
                .map(
                  (key, i) =>
                    `<option ${
                      i === 0 ? "selected" : ""
                    } value="${key}">${key}</option>`
                )
                .join("")}
              </select>
            </div>
            ${secondKeysMenu}
          </div>
        </div>
      `;

    svg = d3
      .select(innerContainer)
      .append("svg")
      .attr("width", mainWidth)
      .attr("height", mainHeight)
      .append("g")
      .attr("class", "main-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g").attr("class", GROUP_SELECTOR);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);

    // create y-axis
    svg.append("g").attr("class", "y-axis");
    graphContainer.appendChild(innerContainer);
  }

  selectMenu = document.querySelector(`#${selector}-select`);
  secondSelectMenu = document.querySelector(`#${selector}-select-second`);

  return { svg, selectMenu, secondSelectMenu, width, height };
};
