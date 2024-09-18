import React from "react";
import "./styles/displayResults.css";

import Card from "../card/card.tsx";

const DisplayResults = ({ searchResults, onComponentChange }) => {
  return (
    <div className="results">
      {searchResults.map((result) => {
        return (
          <Card
            onComponentChange={onComponentChange}
            id={result.id}
            image={result.posterImage}
            title={result.englishTitle}
            japaneseTitle={result.japaneseTitle}
            episodes={result.episodeCount}
            year={result.releaseYear || "N/A"}
            type={result.showType}
          />
        );
      })}
    </div>
  );
};

export default DisplayResults;
