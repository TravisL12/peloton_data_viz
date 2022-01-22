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

  useEffect(() => {
    if (data.length) {
      const s = parseAttributeSets(data);
      const colors = buildColors(s);
      setSets(s);
      setColors(colors);
    }
  }, [data]);

  return (
    <div className="container">
      <Header setData={setData} />
      <Sidebar colors={colors} sets={sets} />
      <GraphBody />
    </div>
  );
};

export default App;
