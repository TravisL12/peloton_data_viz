import { useEffect, useState } from "react";

import RadioInput from "../components/RadioInput";

import BarChart from "../charts/BarChart";
import OverviewBarChart from "../charts/OverviewBarChart";
import LineChart from "../charts/LineChart";

import DataTable from "./DataTable";
import CheckboxInput from "./CheckboxInput";

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
      <div>
        <div style={{ display: "flex", gap: "10px" }}>
          {currentGraph?.type === "line" ? (
            <CheckboxInput
              currentGraph={currentGraph}
              checkboxes={checkboxes}
              colors={colors}
              handleCheckboxChange={handleCheckboxChange}
            />
          ) : (
            <>
              <RadioInput
                selectKey={"graphKey"}
                label={"Category"}
                keys={currentGraph?.keys}
                value={select.graphKey}
                handleSelectChange={handleSelectChange}
              />
              {currentGraph?.secondKeys && (
                <RadioInput
                  selectKey={"secondKey"}
                  label={"Value"}
                  keys={currentGraph?.secondKeys}
                  value={select.secondKey}
                  handleSelectChange={handleSelectChange}
                />
              )}
            </>
          )}
        </div>
        {currentGraph?.type === "bar" && (
          <BarChart
            data={data}
            colors={colors}
            currentGraph={currentGraph}
            select={select}
          />
        )}
        {currentGraph?.type === "overview" && (
          <OverviewBarChart
            data={data}
            colors={colors}
            currentGraph={currentGraph}
            select={select}
            handleSelectChange={handleSelectChange}
          />
        )}
        {currentGraph?.type === "line" && (
          <LineChart
            data={data}
            colors={colors}
            currentGraph={currentGraph}
            keys={lineKeys}
          />
        )}
      </div>
      <DataTable data={data} />
    </div>
  );
};

export default GraphBody;
