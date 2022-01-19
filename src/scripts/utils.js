import * as d3 from "d3";
import { graphContainer } from "./elementSelectors";
import { GROUP_SELECTOR, mainHeight, mainWidth } from "./chartConstants";

const CADENCE_AVG = "cadence_avg";
const HEARTRATE_AVG = "heartrate_avg";
const INCLINE_AVG = "incline_avg";
const PACE_AVG = "pace_avg";
const RESISTANCE_AVG = "resistance_avg";
const SPEED_AVG = "speed_avg";
const WATTS_AVG = "watts_avg";
const CALORIES = "calories";
const CLASS_DATE = "class_date";
const DISTANCE_MILES = "distance_miles";
const FITNESS_DISCIPLINE = "fitness_discipline";
const INSTRUCTOR = "instructor";
const LENGTH_MINUTES = "length_minutes";
const LIVE_ONDEMAND = "live_ondemand";
const TITLE = "title";
const TOTAL_OUTPUT = "total_output";
const TYPE = "type";
const WORKOUT_DATE = "workout_date";

export const allColors = d3.scaleOrdinal(d3.schemeAccent);
export const colors = {
  [INSTRUCTOR]: "red",
  [FITNESS_DISCIPLINE]: "blue",
  [LENGTH_MINUTES]: "lightblue",
  [TOTAL_OUTPUT]: "magenta",
  [DISTANCE_MILES]: "lime",
  [CALORIES]: "pink",
  [CADENCE_AVG]: "goldenrod",
  [HEARTRATE_AVG]: "green",
  // [INCLINE_AVG]: "goldenrod",
  // [PACE_AVG]: "goldenrod",
  [RESISTANCE_AVG]: "yellow",
  [SPEED_AVG]: "orange",
  [WATTS_AVG]: "goldenrod",
  // [CLASS_DATE]: "goldenrod",
  // [LIVE_ONDEMAND]: "goldenrod",
  // [TITLE]: "goldenrod",
  [TYPE]: "goldenrod",
  // [WORKOUT_DATE]: "goldenrod",
};

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

export const getSvg = ({ selector, margin, title }) => {
  let svg;
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  if (document.querySelector(`.${selector}`)) {
    document.querySelector(`.${selector} h3`).textContent = title;
    svg = d3.select(`.${selector} .main-group`);
  } else {
    graphContainer.innerHTML = "";
    const innerContainer = document.createElement("div");
    innerContainer.className = selector;
    innerContainer.innerHTML = `<h3>${title}</h3>`;

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

  return { svg, width, height };
};
