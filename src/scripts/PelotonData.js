import { barChartNames } from "./graphLinks";
import { getUniq } from "./utils";

const parseCount = barChartNames.map(({ key }) => key);

class PelotonData {
  constructor() {
    this.data = { count: {} };
  }

  parseData(data) {
    this.data.raw = data;
    if (this.data.raw) {
      parseCount.forEach((key) => {
        this.parseItemCount(key);
      });
    }
    this.parseHighlights();
    this.parseAttributeSets();
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
