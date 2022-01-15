import { fileInput } from "./scripts/elementSelectors";
import { FilterOptions } from "./scripts/FilterOptions";
import { keys } from "./scripts/utils";

import "./styles/styles.scss";

(function () {
  fileInput.addEventListener("change", (event) => {
    const reader = new FileReader();
    const file = event.currentTarget.files[0];

    reader.readAsBinaryString(file);
    reader.onload = () => {
      const dataLines = reader.result.split("\n");
      const header = dataLines[0].split(",");
      const lines = dataLines.slice(1);

      const data = lines.map((line) => {
        const splitLine = line.split(",");
        return header.reduce((acc, h, idx) => {
          if (!h || !keys[h]) return acc;

          acc[keys[h]] = splitLine[idx];
          return acc;
        }, {});
      });

      new FilterOptions(data);
    };
  });
})();
