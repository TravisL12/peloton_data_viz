import { barChartNames } from "./graphLinks";

const parseCount = barChartNames.map(({ key }) => key);

class PelotonData {
  constructor() {
    this.data = { count: {} };
  }

  parseHighlights() {}

  parseData(data) {
    this.data.raw = data;
    if (this.data.raw) {
      parseCount.forEach((key) => {
        this.parseItemCount(key);
      });
    }
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
