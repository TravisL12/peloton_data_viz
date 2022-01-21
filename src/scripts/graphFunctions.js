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
  const countData = (dataParam, key) => {
    const countData = parseItemCount(dataParam, key);
    const data = Object.entries(countData).map(([name, count]) => ({
      name,
      count,
    }));
    data.sort((a, b) => d3.descending(a.count, b.count));
    return data;
  };
  const keys = ["instructor", "fitness_discipline", "length_minutes", "type"];
  barChart(filteredData, keys, colors, countData, currentGraph.title);
};

const buildSumChart = (filteredData, currentGraph, colors) => {
  const sumData = (dataParam, key) => {
    const attributeSet = parseAttributeSets(dataParam)[key];

    const data = attributeSet.map((setValue) => {
      const setData = dataParam.filter((d) => d[key] === setValue);
      const sumData = filterSum(setData, "total_output");
      return { name: setValue, count: sumData };
    });

    data.sort((a, b) => d3.descending(a.count, b.count));
    return data;
  };

  const keys = ["instructor", "fitness_discipline", "length_minutes", "type"];

  barChart(filteredData, keys, colors, sumData, currentGraph.title);
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
    title: "Count",
    chartFn: buildCountChart,
  },
];

const sumCharts = [
  {
    ...attributes.instructor,
    title: "Sum",
    chartFn: buildSumChart,
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
  sum: sumCharts,
  output: outputCharts,
  speed: speedCharts,
  line: lineCharts,
};
