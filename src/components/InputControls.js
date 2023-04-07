import React from "react";
import CheckboxInput from "./CheckboxInput";
import RadioInput from "./RadioInput";

const InputControls = ({
  currentGraph,
  checkboxes,
  colors,
  handleCheckboxChange,
  handleSelectChange,
  select,
}) => {
  return (
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
  );
};
export default InputControls;
