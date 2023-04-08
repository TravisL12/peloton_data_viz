import * as d3 from "d3";
import { useCallback, useEffect, useState } from "react";

import { typeTransform } from "../constants";

import Sidebar from "../components/Sidebar";
import DataView from "./DataView";
import Instructions from "../components/Instructions";

import { keys, buildColors } from "../utils/utils";
import { parseAttributeSets } from "../utils/parseUtils";
import { graphLinks, lineKeys } from "../utils/graphUtils";

import demoData from "../demo_workout.csv";
import LogoWhite from "../peloton_logo_white.svg";
import GraphLinks from "./GraphLinks";
import DataTable from "./DataTable";

const SLICE_AMOUNT = 300;

const importData = (input) => {
  const dataLines = input.split("\n");
  const header = dataLines[0].split(",");
  const lines = dataLines.slice(1);

  return lines.map((line) => {
    const splitLine = line.split(",");
    return header.reduce((acc, h, idx) => {
      if (!h || !keys[h]) return acc;

      const transformFn = typeTransform[keys[h]];
      const output = transformFn ? transformFn(splitLine[idx]) : splitLine[idx];
      acc[keys[h]] = output;
      return acc;
    }, {});
  });
};

const App = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [sets, setSets] = useState({});
  const [colors, setColors] = useState(null);
  const [filterValues, setFilterValues] = useState(null);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleDemoData = (path) => {
    fetch(path)
      .then((d) => d.text())
      .then((d) => {
        const data = importData(d);
        setData(data);
      });
  };

  const handleOnChange = (event) => {
    const reader = new FileReader();
    const file = event.currentTarget.files[0];

    reader.readAsBinaryString(file);
    reader.onload = () => {
      const data = importData(reader.result);
      setData(data);
    };
  };

  const filterData = useCallback(
    (newData) => {
      const filtered = newData?.filter((d) => {
        return Object.keys(sets).every((type) => filterValues[d[type]]);
      });
      if (filtered) {
        setFilteredData(filtered.slice(-SLICE_AMOUNT));
      }
    },
    [filterValues, sets]
  );

  const sortData = useCallback(
    (key, direction) => {
      const sortedData = data?.sort((a, b) => {
        return direction === "asc"
          ? d3.ascending(a[key], b[key])
          : d3.descending(a[key], b[key]);
      });
      filterData(sortedData);
    },
    [data, filterData]
  );

  useEffect(() => {
    if (data?.length) {
      const parseSets = parseAttributeSets(data);
      const colors = buildColors({ ...parseSets, lines: lineKeys });
      setSets(parseSets);
      setColors(colors);
      setCurrentGraph(graphLinks[0]);
    }
  }, [data]);

  useEffect(() => {
    filterData(data);
  }, [filterData, data]);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={LogoWhite} alt="Logo in white" />
        </div>
        {!!data?.length && (
          <GraphLinks
            graphLinks={graphLinks}
            currentGraph={currentGraph}
            setCurrentGraph={setCurrentGraph}
          />
        )}
      </div>
      <Sidebar
        colors={colors}
        sets={sets}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <div className="main">
        {!!data?.length ? (
          <div id="graph">
            <div className="chart-title">
              <h3>{currentGraph?.title}</h3>
            </div>
            <DataView
              currentGraph={currentGraph}
              colors={colors}
              data={filteredData}
            />
            <DataTable
              colors={colors}
              data={filteredData}
              sortData={sortData}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          </div>
        ) : (
          <Instructions
            handleOnChange={handleOnChange}
            handleDemoData={handleDemoData}
            demoData={demoData}
          />
        )}
      </div>
    </div>
  );
};

export default App;
