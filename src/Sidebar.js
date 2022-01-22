import { useEffect } from "react";
import { attributes } from "./utils";

const Sidebar = ({ sets, colors, filterValues, setFilterValues }) => {
  useEffect(() => {
    const values = Object.values(sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});
    setFilterValues(values);
  }, [sets]);

  const toggleAll = (filter, isChecked = false) => {
    sets[filter].forEach((attr) => {
      filterValues[attr] = isChecked;
      const optionEl = document.getElementById(`option-${attr}`);
      if (optionEl) {
        optionEl.checked = isChecked;
      }
    });
    // updateGraph();
  };

  const handleCheckboxChange = (event) => {
    const copyValues = JSON.parse(JSON.stringify(filterValues));
    copyValues[event.target.name] = event.target.checked;
    setFilterValues(copyValues);
    // updateGraph();
  };

  const handleToggleOn = (filter) => {
    toggleAll(filter, true);
  };

  const handleToggleOff = (filter) => {
    toggleAll(filter);
  };

  return (
    <div className="sidebar">
      <div id="filters">
        {Object.keys(sets)?.map((filter) => {
          return (
            <div key={filter} className="filter-option">
              <h3>{attributes[filter].title}</h3>
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => handleToggleOn(filter)}>All</button>
                <button onClick={() => handleToggleOff(filter)}>None</button>
              </div>
              <form id={`${filter}-form`}>
                <ul className="filters-list">
                  {sets?.[filter]?.map((set) => {
                    return (
                      <li key={set} style={{ background: colors[filter](set) }}>
                        <input
                          onChange={handleCheckboxChange}
                          type="checkbox"
                          name={set}
                          checked={filterValues[set]}
                          id={`option-${set}`}
                        />
                        <label htmlFor={`option-${set}`}>{set}</label>
                      </li>
                    );
                  })}
                </ul>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
