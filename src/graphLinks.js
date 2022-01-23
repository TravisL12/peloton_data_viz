import * as d3 from "d3";
import { filterSum, parseAttributeSets, parseItemCount } from "./parseUtils";
import {
  attributes,
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
} from "./utils";

const lineOutputData = (data, key, compareKey) => {
  const attributeSet = parseAttributeSets(data)[key];
  return attributeSet.map((set) => {
    const d = data
      .filter((d) => d[key] === set && +d[compareKey])
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d[compareKey] };
      });
    return [set, d];
  });
};

const lineData = (data, keys) => {
  return keys.map((key) => {
    const d = data
      .filter((d) => +d[key])
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d[key] };
      });
    return [key, d];
  });
};

const countData = (data, key) => {
  const count = parseItemCount(data, key);
  const output = Object.entries(count).map(([name, count]) => ({
    name,
    count,
  }));
  output.sort((a, b) => d3.descending(a.count, b.count));
  return output;
};

const sumData = (data, key, sumKey = "total_output") => {
  const attributeSet = parseAttributeSets(data)[key];

  const output = attributeSet.map((setValue) => {
    const setData = data.filter((d) => d[key] === setValue);
    const sumData = filterSum(setData, sumKey);
    return { name: setValue, count: sumData };
  });

  output.sort((a, b) => d3.descending(a.count, b.count));
  return output;
};

const keys = [INSTRUCTOR, FITNESS_DISCIPLINE, LENGTH_MINUTES, TYPE];
const secondKeys = [TOTAL_OUTPUT, LENGTH_MINUTES];

export const graphLinks = [
  {
    ...attributes.instructor,
    title: "Count",
    keys,
    dataTransform: countData,
    type: "bar",
  },
  {
    ...attributes.instructor,
    title: "Sum",
    keys,
    secondKeys,
    dataTransform: sumData,
    type: "bar",
  },
  //line
  {
    ...attributes.speed_avg,
    keys: [CADENCE_AVG, RESISTANCE_AVG, SPEED_AVG],
    dataTransform: lineData,
    type: "line",
  },
  {
    ...attributes.distance_miles,
    keys: [CALORIES, DISTANCE_MILES, TOTAL_OUTPUT],
    dataTransform: lineData,
    type: "line",
  },
  {
    ...attributes.calories,
    keys: [CALORIES],
    dataTransform: lineData,
    type: "line",
  },
];
