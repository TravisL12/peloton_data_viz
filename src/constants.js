export const mainWidth = 1000;
export const mainHeight = 400;
export const GROUP_SELECTOR = "g-collection";
export const margin = { top: 10, bottom: 120, left: 40, right: 10 };

export const CADENCE_AVG = "cadence_avg";
export const CALORIES = "calories";
export const CLASS_DATE = "class_date";
export const DISTANCE_MILES = "distance_miles";
export const FITNESS_DISCIPLINE = "fitness_discipline";
export const HEARTRATE_AVG = "heartrate_avg";
export const INCLINE_AVG = "incline_avg";
export const INSTRUCTOR = "instructor";
export const LENGTH_MINUTES = "length_minutes";
export const LIVE_ONDEMAND = "live_ondemand";
export const PACE_AVG = "pace_avg";
export const RESISTANCE_AVG = "resistance_avg";
export const SPEED_AVG = "speed_avg";
export const TITLE = "title";
export const TOTAL_OUTPUT = "total_output";
export const TYPE = "type";
export const WATTS_AVG = "watts_avg";
export const WORKOUT_DATE = "workout_date";

const toNumber = (val) => +val;
const toPercent = (val) => val?.slice(0, -1);
const toDate = (val) => new Date(val);

export const typeTransform = {
  [CADENCE_AVG]: toNumber,
  [CALORIES]: toNumber,
  [CLASS_DATE]: toDate,
  [DISTANCE_MILES]: toNumber,
  [HEARTRATE_AVG]: toNumber,
  [INCLINE_AVG]: toNumber,
  [LENGTH_MINUTES]: toNumber,
  [PACE_AVG]: toNumber,
  [RESISTANCE_AVG]: toPercent,
  [SPEED_AVG]: toNumber,
  [TOTAL_OUTPUT]: toNumber,
  [WATTS_AVG]: toNumber,
  [WORKOUT_DATE]: toDate,
  // [FITNESS_DISCIPLINE]: string
  // [INSTRUCTOR]: string
  // [LIVE_ONDEMAND]: string
  // [TITLE]: string
  // [TYPE]: string
};
