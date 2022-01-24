import * as d3 from "d3";
import { filterSum, parseAttributeSets, parseItemCount } from "./parseUtils";
import {
  INSTRUCTOR,
  TYPE,
  FITNESS_DISCIPLINE,
  LENGTH_MINUTES,
  TOTAL_OUTPUT,
  CADENCE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  DISTANCE_MILES,
  CALORIES,
  WATTS_AVG,
  PACE_AVG,
} from "./constants";

const parseDate = (date) => {
  return d3.timeParse("%Y-%m-%d %H:%M")(date.slice(0, -6));
};

const lineData = (data, keys) => {
  return keys.map((key) => {
    const d = data
      .filter((d) => +d[key])
      .map((d) => {
        const date = parseDate(d.workout_date);
        return { x: date, y: +d[key] };
      });
    return [key, d];
  });
};

const overviewData = (data) => {
  return data.map((d) => {
    const date = parseDate(d.workout_date);
    return { ...d, date: d3.timeFormat("%m/%d")(date), value: 50 };
  });
};

const countData = (data, key) => {
  const count = parseItemCount(data, key);
  const output = Object.entries(count).map(([name, count]) => ({
    [key]: name,
    value: count,
  }));
  output.sort((a, b) => d3.descending(a.value, b.value));
  return output;
};

const sumData = (data, key, sumKey = "total_output") => {
  const attributeSet = parseAttributeSets(data)[key];

  const output = attributeSet.map((setValue) => {
    const setData = data.filter((d) => d[key] === setValue);
    const sumData = filterSum(setData, sumKey);
    return { [key]: setValue, value: sumData };
  });

  output.sort((a, b) => d3.descending(a.value, b.value));
  return output;
};

const keys = [INSTRUCTOR, FITNESS_DISCIPLINE, LENGTH_MINUTES, TYPE];
const secondKeys = [
  TOTAL_OUTPUT,
  LENGTH_MINUTES,
  CALORIES,
  WATTS_AVG,
  DISTANCE_MILES,
];
export const lineKeys = [
  CADENCE_AVG,
  CALORIES,
  DISTANCE_MILES,
  PACE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  TOTAL_OUTPUT,
  WATTS_AVG,
];
export const graphLinks = [
  {
    title: "Count",
    keys,
    dataTransform: countData,
    type: "bar",
  },
  {
    title: "Sum",
    keys,
    secondKeys,
    dataTransform: sumData,
    type: "bar",
  },
  {
    title: "Overview",
    keys,
    dataTransform: overviewData,
    type: "overview",
  },
  //line
  {
    title: "Compare",
    keys: lineKeys,
    dataTransform: lineData,
    type: "line",
  },
];
