import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SelectMenu from "./SelectMenu";

const GraphBody = ({ data, colors, currentGraph }) => {
  const [select, setSelect] = useState({
    graphKey: currentGraph?.keys?.[0],
    secondKey: currentGraph?.secondKeys?.[0],
  });
  const [checkboxes, setCheckboxes] = useState(null);

  useEffect(() => {
    if (!select.graphKey) {
      setSelect({
        graphKey: currentGraph?.keys?.[0],
        secondKey: currentGraph?.secondKeys?.[0],
      });
    }

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

  const buildCheckboxes = () => {
    return currentGraph?.keys.map((key) => {
      return (
        <div key={key} style={{ background: colors.lines(key) }}>
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            name={key}
            checked={checkboxes?.[key]}
            id={`compare-${key}`}
          />
          <label htmlFor={`compare-${key}`}>{key}</label>
        </div>
      );
    });
  };

  const lineKeys = checkboxes
    ? Object.keys(checkboxes).filter((key) => checkboxes[key])
    : [];

  return (
    <div id="graph">
      <div className="chart-title">
        <h3>{currentGraph?.title}</h3>
        {currentGraph?.type === "bar" ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <SelectMenu
              selectKey={"graphKey"}
              label={"Category"}
              keys={currentGraph?.keys}
              handleSelectChange={handleSelectChange}
            />
            {currentGraph?.secondKeys && (
              <SelectMenu
                selectKey={"secondKey"}
                label={"Value"}
                keys={currentGraph?.secondKeys}
                handleSelectChange={handleSelectChange}
              />
            )}
          </div>
        ) : (
          buildCheckboxes()
        )}
      </div>
      {currentGraph && currentGraph?.type === "bar" ? (
        <BarChart
          data={data}
          colors={colors}
          currentGraph={currentGraph}
          select={select}
        />
      ) : (
        <LineChart
          data={data}
          colors={colors}
          currentGraph={currentGraph}
          keys={lineKeys}
        />
      )}
    </div>
  );
};

export default GraphBody;
