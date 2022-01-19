import * as d3 from "d3";
import { barChart } from "./barChart";
import { lineChart } from "./lineChart";

import { BAR_COUNT, LINE_CHART } from "./chartConstants";
import { parseAttributeSets, parseItemCount } from "./parseUtilities";
import { attributes } from "./utils";

const buildCountChart = (filteredData, currentGraph) => {
  const { key, title } = currentGraph;
  const countData = parseItemCount(filteredData, key);
  const data = Object.entries(countData).map(([name, count]) => ({
    name,
    count,
  }));
  data.sort((a, b) => d3.descending(a.count, b.count));
  barChart(data, key, title);
};

const buildInstructorOutputChart = (filteredData, currentGraph) => {
  const { title } = currentGraph;
  const instructors = parseAttributeSets(filteredData).instructor;
  const data = instructors.map((instructor) => {
    const d = filteredData
      .filter((d) => d.instructor === instructor && d.total_output)
      .map((d) => {
        const date = d3.timeParse("%Y-%m-%d %H:%M")(
          d.workout_date.slice(0, -6)
        );
        return { x: date, y: +d.total_output };
      });
    return [instructor, d];
  });

  lineChart(data, "instructors", title);
};

const buildLineChart = (filteredData, currentGraph) => {
  const { key, keys, title } = currentGraph;
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
  lineChart(data, key, title);
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
    keys: ["cadence_avg", "resistance_avg", "speed_avg"],
    chartFn: buildLineChart,
  },
  {
    ...attributes.distance_miles,
    keys: ["distance_miles", "calories", "total_output"],
    chartFn: buildLineChart,
  },
  {
    ...attributes.calories,
    keys: ["calories"],
    chartFn: buildLineChart,
  },
];
