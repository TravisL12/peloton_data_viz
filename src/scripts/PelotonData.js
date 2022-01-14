import { getUniq, barChartNames } from "./utils";

const mapCountKeys = barChartNames.map(({ key }) => key);

class PelotonData {
  constructor() {
    this.data = { count: {} };
  }

  parseData(data) {
    this.data.raw = data;
    if (this.data.raw) {
      mapCountKeys.forEach((key) => {
        this.parseItemCount(key);
      });
    }
    return this.data;
  }

  // have some fun stats picked out here for landing page
  parseHighlights() {
    this.data.highlights = [];
  }

  parseAttributeSets() {
    this.data.sets = [
      "instructor",
      "fitness_discipline",
      "length_minutes",
      "type",
    ].reduce((acc, key) => {
      const mappedValues = this.data.raw.map((d) => d[key]).filter((x) => x);
      acc[key] = getUniq(mappedValues);
      return acc;
    }, {});
    return this.data.sets;
  }

  parseItemCount(key) {
    const data = this.data.raw.map((d) => d[key]).filter((x) => x);
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
