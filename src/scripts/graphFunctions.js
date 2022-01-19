import * as d3 from "d3";
import { barChart } from "./barChart";
import { lineChart } from "./lineChart";

import { parseAttributeSets, parseItemCount } from "./parseUtilities";
import {
  attributes,
  CADENCE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  CALORIES,
  DISTANCE_MILES,
  TOTAL_OUTPUT,
} from "./utils";

const buildCountChart = (filteredData, currentGraph, colors) => {
  const { key, title } = currentGraph;
  const countData = parseItemCount(filteredData, key);
  const data = Object.entries(countData).map(([name, count]) => ({
    name,
    count,
  }));
  data.sort((a, b) => d3.descending(a.count, b.count));
  barChart(data, title, colors);
};

const buildInstructorOutputChart = (filteredData, currentGraph, colors) => {
  const { title } = currentGraph;
  const instructors = parseAttributeSets(filteredData).instructor;
  const data = instructors.map((instructor) => {
    const d = filteredData
      .filter((d) => d.instructor === instructor && +d.total_output)
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d.total_output };
      });
    return [instructor, d];
  });

  lineChart(data, title, colors);
};

const buildLineChart = (filteredData, currentGraph, colors) => {
  const { keys, title } = currentGraph;
  const data = keys.map((key) => {
    const d = filteredData
      .filter((d) => +d[key])
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d[key] };
      });
    return [key, d];
  });
  lineChart(data, title, colors);
};

export const chartNames = [
  {
    ...attributes.instructor,
    title: "Instructors output",
    chartFn: buildInstructorOutputChart,
  },
  { ...attributes.instructor, chartFn: buildCountChart },
  {
    ...attributes.fitness_discipline,
    chartFn: buildCountChart,
  },
  { ...attributes.length_minutes, chartFn: buildCountChart },
  {
    ...attributes.speed_avg,
    keys: [CADENCE_AVG, RESISTANCE_AVG, SPEED_AVG],
    chartFn: buildLineChart,
  },
  {
    ...attributes.distance_miles,
    keys: [CALORIES, DISTANCE_MILES, TOTAL_OUTPUT],
    chartFn: buildLineChart,
  },
  {
    ...attributes.calories,
    keys: [CALORIES],
    chartFn: buildLineChart,
  },
];
