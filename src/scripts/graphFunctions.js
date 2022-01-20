import * as d3 from "d3";
import { barChart } from "./barChart";
import { lineChart } from "./lineChart";

import {
  filterSum,
  parseAttributeSets,
  parseItemCount,
} from "./parseUtilities";
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

const buildSumChart = (filteredData, currentGraph, colors) => {
  const { key, title } = currentGraph;
  const attributeSet = parseAttributeSets(filteredData)[key];

  const data = attributeSet.map((instructor) => {
    const instructorData = filteredData.filter(
      (d) => d.instructor === instructor
    );
    const sumData = filterSum(instructorData, "total_output");
    return { name: instructor, count: sumData };
  });

  data.sort((a, b) => d3.descending(a.count, b.count));
  barChart(data, title, colors);
};

const instructorOutputChart = (filteredData, currentGraph, colors) => {
  buildOutputChart(filteredData, currentGraph, colors, "total_output");
};

const instructorSpeedChart = (filteredData, currentGraph, colors) => {
  buildOutputChart(filteredData, currentGraph, colors, "speed_avg");
};

const lengthOutputChart = (filteredData, currentGraph, colors) => {
  buildOutputChart(filteredData, currentGraph, colors, "total_output");
};

const typeOutputChart = (filteredData, currentGraph, colors) => {
  buildOutputChart(filteredData, currentGraph, colors, "total_output");
};

const buildOutputChart = (filteredData, currentGraph, colors, compareKey) => {
  const { key, title } = currentGraph;
  const attributeSet = parseAttributeSets(filteredData)[key];
  const data = attributeSet.map((set) => {
    const d = filteredData
      .filter((d) => d[key] === set && +d[compareKey])
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d[compareKey] };
      });
    return [set, d];
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

const countCharts = [
  {
    ...attributes.instructor,
    title: "Instructors (count)",
    chartFn: buildCountChart,
  },
  {
    ...attributes.fitness_discipline,
    title: "Fitness Discipline (count)",
    chartFn: buildCountChart,
  },
  {
    ...attributes.length_minutes,
    title: "Length Minutes (count)",
    chartFn: buildCountChart,
  },
  {
    ...attributes.type,
    title: "Type (count)",
    chartFn: buildCountChart,
  },
];

const outputCharts = [
  {
    ...attributes.type,
    title: "Type (output)",
    chartFn: typeOutputChart,
  },
  {
    ...attributes.instructor,
    title: "Instructors (output)",
    chartFn: instructorOutputChart,
  },
  {
    ...attributes.length_minutes,
    title: "Length (output)",
    chartFn: lengthOutputChart,
  },
];

const sumCharts = [
  {
    ...attributes.instructor,
    title: "Instructors (sum)",
    chartFn: buildSumChart,
  },
];

const speedCharts = [
  {
    ...attributes.instructor,
    title: "Instructors (speed)",
    chartFn: instructorSpeedChart,
  },
];

const lineCharts = [
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

export const chartNames = {
  count: countCharts,
  output: outputCharts,
  speed: speedCharts,
  line: lineCharts,
  sum: sumCharts,
};
