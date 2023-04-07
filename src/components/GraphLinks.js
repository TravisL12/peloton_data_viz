import React from "react";

const GraphLinks = ({ graphLinks, currentGraph, setCurrentGraph }) => {
  return (
    <ul id="graph-links">
      {graphLinks.map((link) => {
        const isActive = currentGraph?.title === link.title;
        return (
          <li
            key={link.title}
            className={isActive ? "active-link" : ""}
            onClick={() => setCurrentGraph(link)}
          >
            {link.title}
          </li>
        );
      })}
    </ul>
  );
};
export default GraphLinks;
