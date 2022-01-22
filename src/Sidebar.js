import { attributes } from "./utils";

const Sidebar = ({ sets, colors }) => {
  const filterTypes = Object.keys(sets);
  const filterValues = Object.values(sets)
    .flat()
    .reduce((acc, set) => {
      acc[set] = true;
      return acc;
    }, {});

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

  // Check/Uncheck
  const handleCheckboxChange = (event) => {
    filterValues[event.target.value] = event.target.checked;
    // updateGraph();
  };

  // All On
  const handleToggleOn = (filter) => {
    toggleAll(filter, true);
  };

  // All Off
  const handleToggleOff = (filter) => {
    toggleAll(filter);
  };

  return (
    <div className="sidebar">
      <div id="filters">
        {filterTypes?.map((filter) => {
          return (
            <div className="filter-option">
              <h3>{attributes[filter].title}</h3>
              <div>
                <button onClick={() => handleToggleOn(filter)}>All</button>
                <button onClick={() => handleToggleOff(filter)}>None</button>
              </div>
              <form id={`${filter}-form`}>
                <ul class="filters-list">
                  {sets?.[filter]?.map((set) => {
                    return (
                      <li style={{ background: colors[filter](set) }}>
                        <input
                          onChange={handleCheckboxChange}
                          type="checkbox"
                          value={set}
                          checked
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
