import * as d3 from "d3";
import { graphContainer } from "./elementSelectors";
import { GROUP_SELECTOR, mainHeight, mainWidth } from "./chartConstants";

// sample data
// Avg. Cadence (RPM): "79"
// Avg. Heartrate: ""
// Avg. Incline: ""
// Avg. Pace (min/mi): ""
// Avg. Resistance: "41%"
// Avg. Speed (mph): "16.92"
// Avg. Watts: "119"
// Calories Burned: "205"
// Class Timestamp: "2020-03-18 07:21 (PST)"
// Distance (mi): "5.63"
// Fitness Discipline: "Cycling"
// Instructor Name: "Leanne Hainsby"
// Length (minutes): "20"
// Live/On-Demand: "On Demand"
// Title: "20 min Beginner Ride"
// Total Output: "143"
// Type: "Beginner"
// Workout Timestamp: "2020-04-07 16

export const keys = {
  "Avg. Cadence (RPM)": "cadence_avg",
  "Avg. Heartrate": "heartrate_avg",
  "Avg. Incline": "incline_avg",
  "Avg. Pace (min/mi)": "pace_avg",
  "Avg. Resistance": "resistance_avg",
  "Avg. Speed (mph)": "speed_avg",
  "Avg. Watts": "watts_avg",
  "Calories Burned": "calories",
  "Class Timestamp": "class_date",
  "Distance (mi)": "distance_miles",
  "Fitness Discipline": "fitness_discipline",
  "Instructor Name": "instructor",
  "Length (minutes)": "length_minutes",
  "Live/On-Demand": "live_ondemand",
  Title: "title",
  "Total Output": "total_output",
  Type: "type",
  "Workout Timestamp": "workout_date",
};

export const attributes = Object.keys(keys).reduce((acc, title) => {
  const key = keys[title];
  acc[key] = { key, title };
  return acc;
}, {});

export const chartNames = [
  { ...attributes.instructor, type: "bar" },
  { ...attributes.fitness_discipline, type: "bar" },
  { ...attributes.length_minutes, type: "bar" },
  { ...attributes.total_output, type: "line" },
  { ...attributes.distance_miles, type: "line" },
  { ...attributes.calories, type: "line" },
];

// not sure I need this
export const getUniq = (data) => {
  return [...new Set(data)];
};

export const getSvg = ({ selector, margin, key, title }) => {
  let svg;
  const width = mainWidth - margin.left - margin.right;
  const height = mainHeight - margin.top - margin.bottom;

  if (document.querySelector(`.${selector}`)) {
    document.querySelector(`.${selector} h3`).textContent = title;
    svg = d3.select(`.${selector} .main-group`);
  } else {
    const innerContainer = document.createElement("div");
    innerContainer.className = selector;
    innerContainer.id = `${key}-id`;
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
