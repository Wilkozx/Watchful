import React from "react";
import "./styles/card.css";

const Card = ({
  onComponentChange,
  id,
  image,
  title,
  japaneseTitle,
  episodes,
  year,
  type,
}) => {
  const handleCardClick = () => {
    onComponentChange("anime:" + id);
  };

  return (
    <div className="card" id={id} onClick={handleCardClick}>
      <div className="card-top">
        <img className="cardImage" src={image} alt={title} />
      </div>
      <div className="card-textcontent">
        <h3>{japaneseTitle}</h3>
        <h2>{title}</h2>
      </div>
      <div className="card-bottom">
        <div className="card-details">
          <div className="card-episode">
            <p>EP {episodes}</p>
            <div className="shape"></div>
          </div>
          <div className="card-episode">
            <p id="card-year">{year}</p>
            <p id="card-year">{year.substring(0, 4)}</p>
            <div className="shape2"></div>
          </div>
        </div>
        <p>{type}</p>
      </div>
    </div>
  );
};

export default Card;
