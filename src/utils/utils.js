import * as d3 from "d3";

import {
  mainWidth,
  mainHeight,
  GROUP_SELECTOR,
  margin,
  CADENCE_AVG,
  HEARTRATE_AVG,
  INCLINE_AVG,
  PACE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  WATTS_AVG,
  CALORIES,
  CLASS_DATE,
  DISTANCE_MILES,
  FITNESS_DISCIPLINE,
  INSTRUCTOR,
  LENGTH_MINUTES,
  LIVE_ONDEMAND,
  TITLE,
  TOTAL_OUTPUT,
  TYPE,
  WORKOUT_DATE,
} from "../constants";

// these keys are from the CSV raw data
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
  // extra
  "Cal/minute": "perMinute",
};

const schemes = {
  [INSTRUCTOR]: d3.schemeCategory10,
  [FITNESS_DISCIPLINE]: d3.schemeTableau10,
  [LENGTH_MINUTES]: d3.schemeDark2,
  [TYPE]: d3.schemeSet1,
  [SPEED_AVG]: d3.schemeSet1,
  [DISTANCE_MILES]: d3.schemePastel1,
  [CALORIES]: d3.schemePastel1,
  [CADENCE_AVG]: d3.schemePastel1,
  [RESISTANCE_AVG]: d3.schemePastel1,
  [TOTAL_OUTPUT]: d3.schemePastel1,
  lines: d3.schemeSet2,
};

export const getColor = (key, domainExtent) => {
  return d3.scaleOrdinal(schemes[key]).domain(domainExtent);
};

export const buildColors = (sets) => {
  return Object.keys(sets).reduce((acc, setKey) => {
    acc[setKey] = getColor(setKey, sets[setKey]);
    return acc;
  }, {});
};

export const attributes = Object.keys(keys).reduce((acc, title) => {
  const key = keys[title];
  acc[key] = { key, title };
  return acc;
}, {});

export const getUniq = (data) => {
  return [...new Set(data)];
};

export const generateSvg = (ref, height) => {
  const svg = d3
    .select(ref)
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
  return svg;
};

export const prettyDateFormat = (date) => {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
