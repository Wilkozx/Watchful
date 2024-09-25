import React from "react";
import "./styles/watchlist.css";

const Watchlist = ({ onComponentChange }) => {
  const [watchList, setWatchList] = React.useState([]);

  const getWatchList = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/v1/watchlist", {
        method: "GET",
        headers: {
          Authorization: sessionStorage.getItem("token") ?? "",
        },
      });
      setWatchList(await response.json());
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = (id) => {
    onComponentChange("anime:" + id);
  };

  React.useEffect(() => {
    getWatchList();
  }, []);

  return (
    <div className="watchlist-container">
      {watchList.map((item) => (
        <div
          className="watchlist-card"
          onClick={() => handleCardClick(item["id"])}
        >
          <img src={item["image_url"]}></img>
          <h1>{item["english_name"]}</h1>
          <p>{item["id"]}</p>
        </div>
      ))}
    </div>
  );
};

export default Watchlist;
