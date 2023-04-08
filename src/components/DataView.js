import { useEffect, useState } from "react";

import BarChart from "../charts/BarChart";
import OverviewBarChart from "../charts/OverviewBarChart";
import LineChart from "../charts/LineChart";

import InputControls from "./InputControls";

const DataView = ({ data, colors, currentGraph }) => {
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
    <>
      <InputControls
        currentGraph={currentGraph}
        checkboxes={checkboxes}
        colors={colors}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectChange={handleSelectChange}
        select={select}
      />
      <div>
        {currentGraph?.type === "bar" && (
          <BarChart
            data={data}
            currentGraph={currentGraph}
            select={select}
            allColors={colors[select.graphKey]}
          />
        )}
        {currentGraph?.type === "overview" && (
          <OverviewBarChart
            data={data}
            currentGraph={currentGraph}
            select={select}
            handleSelectChange={handleSelectChange}
            allColors={colors[select.graphKey]}
          />
        )}
        {currentGraph?.type === "line" && (
          <LineChart
            data={data}
            currentGraph={currentGraph}
            keys={lineKeys}
            allColors={colors.lines}
          />
        )}
      </div>
    </>
  );
};

export default DataView;
