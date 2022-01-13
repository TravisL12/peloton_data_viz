import { fileInput, fileInputName } from "./scripts/elementSelectors";
import { graphLinks } from "./scripts/graphLinks";
import PelotonData from "./scripts/PelotonData";
import { keys } from "./scripts/utils";

import "./styles/styles.scss";

(function () {
  const pelotonData = new PelotonData();

  fileInput.addEventListener("change", (event) => {
    const reader = new FileReader();
    const file = event.currentTarget.files[0];

    fileInputName.textContent = file.name;

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
      pelotonData.parseData(data);
      pelotonData.parseHighlights();
      graphLinks(pelotonData.data);
    };
  });
})();
