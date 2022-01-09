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

class PelotonData {
  constructor() {
    this.fileInput = document.getElementById("data-upload");
    this.data = this.fileInput.addEventListener("change", (event) => {
      const reader = new FileReader();
      reader.onload = () => this.parseData(reader);
      reader.readAsBinaryString(event.currentTarget.files[0]);
    });
  }

  parseData = (reader) => {
    const dataLines = reader.result.split("\n");
    const header = dataLines[0].split(",");
    const lines = dataLines.slice(1);

    this.data = lines.map((line) => {
      const splitLine = line.split(",");
      return header.reduce((acc, h, idx) => {
        if (!h || !keys[h]) return acc;

        acc[keys[h]] = splitLine[idx];
        return acc;
      }, {});
    });

    console.log(this.data);
  };
}

export default PelotonData;
