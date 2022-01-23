import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SelectMenu from "./SelectMenu";

const GraphBody = ({ data, colors, currentGraph }) => {
  const [select, setSelect] = useState({
    graphKey: currentGraph?.keys?.[0],
    secondKey: currentGraph?.secondKeys?.[0],
  });

  useEffect(() => {
    if (!select.graphKey) {
      setSelect({
        graphKey: currentGraph?.keys?.[0],
        secondKey: currentGraph?.secondKeys?.[0],
      });
    }
  }, [currentGraph]);

  const handleSelectChange = (value, key) => {
    setSelect({ ...select, [key]: value });
  };

  const buildCheckboxes = () => {
    return currentGraph?.keys.map((key) => {
      return (
        <div>
          <input
            // onChange={handleCheckboxChange}
            type="checkbox"
            name={key}
            // checked={filterValues[key]}
            id={`compare-${key}`}
          />
          <label htmlFor={`compare-${key}`}>{key}</label>
        </div>
      );
    });
  };

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
          select={select}
        />
      )}
    </div>
  );
};

export default GraphBody;
