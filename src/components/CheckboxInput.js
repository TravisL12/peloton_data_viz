import { attributes } from "../utils/utils";

const CheckboxInput = ({
  currentGraph,
  checkboxes,
  colors,
  handleCheckboxChange,
}) => (
  <div>
    {currentGraph?.keys.map((key) => {
      return (
        <div key={key} style={{ background: colors.lines(key) }}>
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            name={key}
            checked={checkboxes?.[key]}
            id={`compare-${key}`}
          />
          <label htmlFor={`compare-${key}`}>{attributes[key].title}</label>
        </div>
      );
    })}
  </div>
);

export default CheckboxInput;
