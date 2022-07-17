const Instructions = ({ handleOnChange, handleDemoData, demoData }) => {
  return (
    <div className="instructions">
      <h4>Get Started!</h4>
      <p>
        Visit your{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://members.onepeloton.com/profile/workouts"
        >
          <strong>Peloton workouts page</strong>
        </a>{" "}
        and download your workout data.
      </p>
      <p>
        Then{" "}
        <span style={{ display: "inline-block" }}>
          <input
            id="data-upload"
            type="file"
            name="data-csv"
            accept=".csv"
            onChange={handleOnChange}
          />
          <label htmlFor="data-upload">click here</label>
        </span>{" "}
        to add your data and view your stats
      </p>
      <p>
        Or use{" "}
        <strong
          className="demo-link"
          onClick={() => {
            handleDemoData(demoData);
          }}
        >
          this demo data
        </strong>
      </p>
    </div>
  );
};

export default Instructions;
