class PelotonData {
  constructor() {
    this.data = { count: {} };
  }

  parseData(data) {
    this.data.raw = data;
    if (this.data.raw) {
      ["instructor", "fitness_discipline", "length_minutes"].forEach((key) => {
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
