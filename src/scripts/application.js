// `
// Avg. Cadence (RPM): "79"
// Avg. Heartrate: ""
// Avg. Incline: ""
// Avg. Pace (min/mi): ""
// Avg. Resistance: "41%"
// Avg. Speed (mph): "16.92"
// Avg. Watts: "119"
// Calories Burned: "205"
// Class Timestamp: "2020-03-18 07:21 (PST)"
// Distance (mi): "5.63"
// Fitness Discipline: "Cycling"
// Instructor Name: "Leanne Hainsby"
// Length (minutes): "20"
// Live/On-Demand: "On Demand"
// Title: "20 min Beginner Ride"
// Total Output: "143"
// Type: "Beginner"
// Workout Timestamp: "2020-04-07 16
// `;

const keys = {
  "Avg. Cadence (RPM)": "cadence_avg",
  "Avg. Heartrate": "heartrate_avg",
  "Avg. Incline": "incline_avg",
  "Avg. Pace (min/mi)": "pace_avg",
  "Avg. Resistance": "resistance_avg",
  "Avg. Speed (mph)": "speed_avg",
  "Avg. Watts": "watts_avg",
  "Calories Burned": "calories",
  "Class Timestamp": "class_date",
  "Distance (mi)": "distance_miles",
  "Fitness Discipline": "fitness_discipline",
  "Instructor Name": "instructor",
  "Length (minutes)": "length_minutes",
  "Live/On-Demand": "live_ondemand",
  Title: "title",
  "Total Output": "total_output",
  Type: "type",
  "Workout Timestamp": "workout_date",
};

const getUniq = (data) => {
  return [...new Set(data)];
};

class PelotonData {
  constructor() {
    this.data = {};
    this.fileInput = document.getElementById("data-upload");
    this.fileInput.addEventListener("change", (event) => {
      const reader = new FileReader();
      reader.onload = () => this.buildData(reader);
      reader.readAsBinaryString(event.currentTarget.files[0]);
    });
  }

  parseData() {
    if (this.data.raw) {
      ["instructor", "fitness_discipline"].forEach((key) => {
        this.parseItemCount(key);
      });
      console.log(this.data);
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
    this.data[`${key}-count`] = count;
  }

  buildData = (reader) => {
    const dataLines = reader.result.split("\n");
    const header = dataLines[0].split(",");
    const lines = dataLines.slice(1);

    this.data.raw = lines.map((line) => {
      const splitLine = line.split(",");
      return header.reduce((acc, h, idx) => {
        if (!h || !keys[h]) return acc;

        acc[keys[h]] = splitLine[idx];
        return acc;
      }, {});
    });

    this.parseData();
  };
}

export default PelotonData;
