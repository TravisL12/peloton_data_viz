import React from "react";
import {
  CLASS_DATE,
  INSTRUCTOR,
  FITNESS_DISCIPLINE,
  LENGTH_MINUTES,
  TOTAL_OUTPUT,
  DISTANCE_MILES,
  CADENCE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  HEARTRATE_AVG,
  PACE_AVG,
} from "../constants";
import { prettyDateFormat, attributes } from "../utils/utils";
const tableHeaders = [
  CLASS_DATE,
  INSTRUCTOR,
  FITNESS_DISCIPLINE,
  LENGTH_MINUTES,
  TOTAL_OUTPUT,
  DISTANCE_MILES,
  CADENCE_AVG,
  RESISTANCE_AVG,
  SPEED_AVG,
  HEARTRATE_AVG,
  PACE_AVG,
];

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="data-table-container">
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header}>{attributes[header].title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => {
            return (
              <tr>
                {tableHeaders.map((header) => {
                  let value = d[header];
                  if (!value) {
                    return null;
                  }

                  if (header === CLASS_DATE) {
                    value = prettyDateFormat(value);
                  }
                  return <td key={`value-${header}`}>{value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
