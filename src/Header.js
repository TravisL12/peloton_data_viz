import { RESISTANCE_AVG, typeTransform } from "./constants";
import { keys } from "./utils";

const Header = ({ setData }) => {
  const handleOnChange = (event) => {
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

          acc[keys[h]] = typeTransform[keys[h]]
            ? typeTransform[keys[h]](splitLine[idx])
            : splitLine[idx];

          return acc;
        }, {});
      });

      setData(data);
    };
  };

  return (
    <div className="header">
      <span>Peloton</span>
      <div style={{ display: "flex" }}>
        <input
          id="data-upload"
          type="file"
          name="data-csv"
          accept=".csv"
          onChange={handleOnChange}
        />
        <label htmlFor="data-upload">Upload Peloton data</label>
        <div id="file-name"></div>
      </div>
    </div>
  );
};

export default Header;
