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
            id={result.mal_id}
            image={result["images"]["jpg"]["large_image_url"]}
            title={result.title_english || result.title}
            japaneseTitle={result.title_japanese}
            episodes={result.episodes}
            year={result.year}
            type={result.type}
          />
        );
      })}
    </div>
  );
};

export default DisplayResults;
