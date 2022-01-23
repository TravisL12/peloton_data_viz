import { useEffect, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import GraphBody from "./GraphBody";
import { parseAttributeSets } from "./parseUtils";
import { buildColors } from "./utils";
import { graphLinks } from "./graphLinks";

const App = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [sets, setSets] = useState({});
  const [colors, setColors] = useState(null);
  const [filterValues, setFilterValues] = useState(null);
  const [currentGraph, setCurrentGraph] = useState(null);

  useEffect(() => {
    if (data?.length) {
      const parseSets = parseAttributeSets(data);
      const colors = buildColors(parseSets);
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
      <Header setData={setData} />
      <Sidebar
        colors={colors}
        sets={sets}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <div className="main">
        {!!data?.length && (
          <>
            <ul id="graph-links">
              {graphLinks.map((link) => {
                return (
                  <li
                    key={link.title}
                    className="options-item"
                    onClick={() => setCurrentGraph(link)}
                  >
                    {link.title}
                  </li>
                );
              })}
            </ul>
            <GraphBody
              currentGraph={currentGraph}
              colors={colors}
              data={filteredData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
