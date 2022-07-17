import { attributes } from "../utils/utils";

const RadioInput = ({ value, selectKey, label, keys, handleSelectChange }) => (
  <div className={selectKey}>
    <label>{label}</label>
    <div>
      {keys?.map((key) => (
        <div key={key}>
          <input
            name={selectKey}
            type="radio"
            id={`${key}-${label}`}
            value={key}
            checked={value === key}
            onChange={(event) => {
              handleSelectChange(event.target.value, selectKey);
            }}
          />
          <label htmlFor={`${key}-${label}`}>{attributes[key].title}</label>
        </div>
      ))}
    </div>
  </div>
);

export default RadioInput;
