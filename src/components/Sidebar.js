import { useEffect } from "react";
import { attributes } from "../utils/utils";

const Sidebar = ({ sets, colors, filterValues, setFilterValues }) => {
  useEffect(() => {
    const values = Object.values(sets)
      .flat()
      .reduce((acc, set) => {
        acc[set] = true;
        return acc;
      }, {});
    setFilterValues(values);
  }, [sets, setFilterValues]);

  const handleCheckboxChange = (event) => {
    const copyValues = JSON.parse(JSON.stringify(filterValues));
    copyValues[event.target.name] = event.target.checked;
    setFilterValues(copyValues);
  };

  const toggleAll = (filter, isChecked = false) => {
    const copyValues = JSON.parse(JSON.stringify(filterValues));
    sets[filter].forEach((attr) => {
      copyValues[attr] = isChecked;
    });
    setFilterValues(copyValues);
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
              <ul className="filters-list">
                {sets?.[filter].map((set) => {
                  return (
                    filterValues[set] !== undefined && (
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
                    )
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
