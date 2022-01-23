const SelectMenu = ({ selectKey, label, keys, handleSelectChange }) => {
  return (
    <div className={selectKey}>
      <label>{label}</label>
      <select
        name={selectKey}
        id={selectKey}
        onChange={(event) => {
          handleSelectChange(event.target.value, selectKey);
        }}
      >
        {keys?.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMenu;
