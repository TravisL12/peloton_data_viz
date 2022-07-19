import { useEffect, useState } from "react";

import { typeTransform } from "../constants";

import Sidebar from "../components/Sidebar";
import GraphBody from "../components/GraphBody";
import Instructions from "../components/Instructions";

import { keys, buildColors } from "../utils/utils";
import { parseAttributeSets } from "../utils/parseUtils";
import { graphLinks, lineKeys } from "../utils/graphLinks";

import demoData from "../demo_workout.csv";
import LogoWhite from "../peloton_logo_white.svg";

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
    const filtered = data?.filter((d) => {
      return Object.keys(sets).every((type) => filterValues[d[type]]);
    });
    setFilteredData(filtered);
  }, [filterValues, data, sets]);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={LogoWhite} alt="Logo in white" />
        </div>
        {!!data?.length && (
          <ul id="graph-links">
            {graphLinks.map((link) => {
              const isActive = currentGraph?.title === link.title;
              return (
                <li
                  key={link.title}
                  className={isActive ? "active-link" : ""}
                  onClick={() => setCurrentGraph(link)}
                >
                  {link.title}
                </li>
              );
            })}
          </ul>
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
          <GraphBody
            currentGraph={currentGraph}
            colors={colors}
            data={filteredData}
          />
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
