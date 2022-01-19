import * as d3 from "d3";
import {
  getUniq,
  INSTRUCTOR,
  FITNESS_DISCIPLINE,
  LENGTH_MINUTES,
  TYPE,
} from "./utils";

const filterSum = (filteredData, sumKey) =>
  filteredData.reduce((acc, d) => {
    return +d[sumKey] ? acc + +d[sumKey] : acc;
  }, 0);

const outputHighlights = (data, sets, key) => {
  return sets[key].map((value) => {
    const filtered = data.filter((d) => d[key] === value);
    const highestOutput = Math.max(
      ...filtered.map(({ total_output }) =>
        total_output && !isNaN(total_output) ? +total_output : 0
      )
    );
    const totalOutputBins = d3.bin()(
      filtered.map(({ total_output }) =>
        total_output && !isNaN(total_output) ? +total_output : 0
      )
    );
    const fitnessDisciplines = getUniq(
      filtered.map(({ fitness_discipline }) => fitness_discipline)
    );
    const rideTime = getUniq(
      filtered.map(({ length_minutes }) => length_minutes)
    );
    const types = getUniq(filtered.map(({ type }) => type));
    const totalOutput = filterSum(filtered, "total_output");
    const totalDistance = filterSum(filtered, "distance_miles");
    const totalTime = filterSum(filtered, "length_minutes");

    return {
      type: value,
      highestOutput,
      fitnessDisciplines,
      rideTime,
      types,
      count: filtered.length,
      totalOutput,
      totalOutputBins,
      totalDistance: Math.floor(totalDistance),
      totalTime,
    };
  });
};

export const parseItemCount = (inputData, key) => {
  const data = inputData.map((d) => d[key]).filter((x) => x);
  const count = data.reduce((acc, name) => {
    if (!acc[name]) {
      acc[name] = 0;
    }
    acc[name] += 1;
    return acc;
  }, {});
  return count;
};

export const parseAttributeSets = (data) => {
  return [INSTRUCTOR, FITNESS_DISCIPLINE, LENGTH_MINUTES, TYPE].reduce(
    (acc, key) => {
      const mappedValues = data.map((d) => d[key]).filter((x) => x);
      acc[key] = getUniq(mappedValues);
      return acc;
    },
    {}
  );
};

export const parseHighlights = (data, sets) => {
  // average distance per instructor
  // highest output per month
  // other various rates
  const highlights = {};
  highlights.instructors = {
    type: "instructor",
    highlights: outputHighlights(data, sets, "instructor"),
  };
  highlights.fitnessDiscipline = {
    type: "fitness_discipline",
    highlights: outputHighlights(data, sets, "fitness_discipline"),
  };

  return highlights;
};
