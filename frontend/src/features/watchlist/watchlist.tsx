import React from "react";
import "./styles/watchlist.css";

const Watchlist = () => {
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

  React.useEffect(() => {
    getWatchList();
  }, []);

  return (
    <div className="watchlist-container">
      <h1>Watchlist</h1>
      {watchList.map((item) => (
        <div>
          <img src={item[3]}></img>
          <h1>{item[1]}</h1>
        </div>
      ))}
    </div>
  );
};

export default Watchlist;
