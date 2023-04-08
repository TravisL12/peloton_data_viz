import React, { useState } from "react";
import {
  WORKOUT_DATE,
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
  WORKOUT_DATE,
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

const DataTable = ({
  sortData,
  data,
  colors,
  sortDirection,
  setSortDirection,
}) => {
  if (!data || data.length === 0) {
    return null;
  }
  const rowKey = (d) => {
    const sum = d[LENGTH_MINUTES] + d[TOTAL_OUTPUT];
    return `${d[WORKOUT_DATE]}-${d[INSTRUCTOR]}-${sum}`;
  };

  return (
    <div className="data-table-container">
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                onClick={() => {
                  const direction = sortDirection === "asc" ? "desc" : "asc";
                  sortData(header, direction);
                  setSortDirection(direction);
                }}
              >
                {attributes[header].title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => {
            return (
              <tr key={rowKey(d)}>
                {tableHeaders.map((header) => {
                  const color = colors[header];
                  let value = d[header];
                  if (!value) {
                    return null;
                  }

                  if (header === WORKOUT_DATE) {
                    value = prettyDateFormat(value);
                  }
                  return (
                    <td
                      key={`value-${header}`}
                      style={{ background: color ? color(value) : "white" }}
                    >
                      {value}
                    </td>
                  );
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
