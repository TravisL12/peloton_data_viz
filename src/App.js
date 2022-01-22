import { useEffect, useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import GraphBody from "./GraphBody";
import { parseAttributeSets } from "./parseUtils";
import { buildColors } from "./utils";

const App = () => {
  const [data, setData] = useState([]);
  const [sets, setSets] = useState({});
  const [colors, setColors] = useState(null);
  const [filterValues, setFilterValues] = useState(null);

  useEffect(() => {
    if (data.length) {
      const parseSets = parseAttributeSets(data);
      const colors = buildColors(parseSets);
      setSets(parseSets);
      setColors(colors);
    }
  }, [data]);

  useEffect(() => {
    const filteredData = data.filter((d) => {
      return Object.keys(sets).every((type) => filterValues[d[type]]);
    });
    console.log("filter", filteredData);
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
      <GraphBody />
    </div>
  );
};

export default App;
