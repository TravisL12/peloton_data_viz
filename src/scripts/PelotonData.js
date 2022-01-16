import { getUniq, chartNames } from "./utils";

const mapCountKeys = chartNames.map(({ key }) => key);
class PelotonData {
  constructor(data) {
    this.data = { count: {} };
    this.data.original = data;
    this.parseAttributeSets();
    this.parseHighlights();
  }

  parseData(data) {
    this.data.parsed = data;
    mapCountKeys.forEach((key) => {
      this.parseItemCount(key);
    });
  }

  outputHighlights(key) {
    const filterSum = (filteredData, sumKey) =>
      filteredData.reduce((acc, d) => {
        return +d[sumKey] ? acc + +d[sumKey] : acc;
      }, 0);

    return this.sets[key].map((value) => {
      const filtered = this.data.original.filter((d) => d[key] === value);
      const totalOutput = filterSum(filtered, "total_output");
      const totalDistance = filterSum(filtered, "distance_miles");
      const totalTime = filterSum(filtered, "length_minutes");
      return {
        type: value,
        count: filtered.length,
        totalOutput,
        totalDistance: Math.floor(totalDistance),
        totalTime,
      };
    });
  }

  // have some fun stats picked out here for landing page
  parseHighlights() {
    // average distance per instructor
    // highest output per month
    // other various rates
    this.highlights = {};
    this.highlights.instructors = {
      type: "instructor",
      highlights: this.outputHighlights("instructor"),
    };
    this.highlights.fitnessDiscipline = {
      type: "fitness_discipline",
      highlights: this.outputHighlights("fitness_discipline"),
    };
  }

  parseAttributeSets() {
    this.sets = [
      "instructor",
      "fitness_discipline",
      "length_minutes",
      "type",
    ].reduce((acc, key) => {
      const mappedValues = this.data.original
        .map((d) => d[key])
        .filter((x) => x);
      acc[key] = getUniq(mappedValues);
      return acc;
    }, {});
  }

  parseItemCount(key) {
    const data = this.data.parsed.map((d) => d[key]).filter((x) => x);
    const count = data.reduce((acc, name) => {
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name] += 1;
      return acc;
    }, {});
    this.data.count[key] = count;
  }
}

export default PelotonData;
