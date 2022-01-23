const SelectMenu = ({ tagAttr, label, keys }) => {
  // SETUP ONCHANGE EVENTS!!!!!!!!!!!!!!!!!!
  return (
    <div className={tagAttr}>
      <label>{label}</label>
      <select name={tagAttr} id={tagAttr}>
        {keys?.map((key, i) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMenu;
