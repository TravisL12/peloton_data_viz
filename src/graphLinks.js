import * as d3 from "d3";
import { filterSum, parseAttributeSets, parseItemCount } from "./parseUtils";
import { attributes } from "./utils";

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

const keys = ["instructor", "fitness_discipline", "length_minutes", "type"];
const secondKeys = ["total_output", "length_minutes"];

export const graphLinks = [
  {
    ...attributes.instructor,
    title: "Count",
    keys,
    dataTransform: countData,
  },
  {
    ...attributes.instructor,
    title: "Sum",
    keys,
    secondKeys,
    dataTransform: sumData,
  },
];
