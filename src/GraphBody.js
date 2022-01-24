import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

const GraphBody = ({ data, colors, currentGraph }) => {
  const [select, setSelect] = useState({
    graphKey: currentGraph?.keys?.[0],
    secondKey: currentGraph?.secondKeys?.[0],
  });
  const [checkboxes, setCheckboxes] = useState(null);

  useEffect(() => {
    setSelect({
      graphKey: select.graphKey || currentGraph?.keys?.[0],
      secondKey: select.secondKey || currentGraph?.secondKeys?.[0],
    });

    if (currentGraph?.type === "line") {
      const checkboxKeys = currentGraph?.keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setCheckboxes(checkboxKeys);
    }
  }, [currentGraph]);
  const handleSelectChange = (value, key) => {
    setSelect({ ...select, [key]: value });
  };

  const handleCheckboxChange = (event) => {
    const copyValues = JSON.parse(JSON.stringify(checkboxes));
    copyValues[event.target.name] = event.target.checked;
    setCheckboxes(copyValues);
  };

  const lineKeys = checkboxes
    ? Object.keys(checkboxes).filter((key) => checkboxes[key])
    : [];

  return (
    <div id="graph">
      <div className="chart-title">
        <h3>{currentGraph?.title}</h3>
      </div>
      {currentGraph?.type === "bar" ? (
        <BarChart
          data={data}
          colors={colors}
          currentGraph={currentGraph}
          select={select}
          handleSelectChange={handleSelectChange}
        />
      ) : (
        <LineChart
          data={data}
          colors={colors}
          currentGraph={currentGraph}
          keys={lineKeys}
          checkboxes={checkboxes}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
    </div>
  );
};

export default GraphBody;
