import * as d3 from "d3";
import { filterSum, parseAttributeSets, parseItemCount } from "./parseUtils";
import { attributes } from "./utils";

const countData = (dataParam, key) => {
  const count = parseItemCount(dataParam, key);
  const data = Object.entries(count).map(([name, count]) => ({
    name,
    count,
  }));
  data.sort((a, b) => d3.descending(a.count, b.count));
  return data;
};
// const keys = ["instructor", "fitness_discipline", "length_minutes", "type"];

const sumData = (dataParam, key, sumKey = "total_output") => {
  const attributeSet = parseAttributeSets(dataParam)[key];

  const data = attributeSet.map((setValue) => {
    const setData = dataParam.filter((d) => d[key] === setValue);
    const sumData = filterSum(setData, sumKey);
    return { name: setValue, count: sumData };
  });

  data.sort((a, b) => d3.descending(a.count, b.count));
  return data;
};

export const graphLinks = [
  {
    ...attributes.instructor,
    title: "Count",
    chartFn: countData,
  },
  {
    ...attributes.instructor,
    title: "Sum",
    chartFn: sumData,
  },
];
