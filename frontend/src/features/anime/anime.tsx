import React, { useEffect } from "react";
import "./styles/anime.css";

const Anime = ({ selectedComponent }) => {
  const [playTrailer, setPlayTrailer] = React.useState(false);
  const [episodes, setEpisodes] = React.useState([]);
  const [animeData, setAnimeData] = React.useState({
    id: selectedComponent.split(":")[1],
    backgroundImage: "",
    coverImage: "",
    japanese_title: "",
    english_title: "",
    synopsis: "",
    trailer: "",
    trailerImage: "",
    type: "",
    episodeCount: 0,
    status: "",
    airedFrom: "",
    airedTo: "",
  });

  const getAnime = async () => {
    let response = await fetch(
      "http://localhost:5000/api/v1/anime/" + animeData["id"],
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      let data = await response.json();

      setAnimeData((prevData) => ({
        ...prevData,
        backgroundImage: data["posterImage"] ?? "",
        coverImage: data["coverImage"] ?? "",
        japanese_title: data["canonicalTitle"] ?? "",
        english_title: data["englishTitle"] ?? "",
        synopsis: data["synopsis"] ?? "",
        trailer:
          "https://www.youtube.com/embed/" +
          data["youtubeVideoId"] +
          "?enablejsapi=1&wmode=opaque&autoplay=1",
        trailerImage: data["coverImage"],
        type: data["subtype"],
        episodeCount: data["episodeCount"],
        status: data["status"],
        airedFrom: data["startDate"],
        airedTo: data["endDate"],
      }));

      getEpisodes();
    }
  };

  const getEpisodes = async () => {
    let response = await fetch(
      "http://localhost:5000/api/v1/anime/" + animeData["id"] + "/episodes",
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      let data = await response.json();
      setEpisodes(data);
    }
  };

  const addToWatchlist = async (tag) => {
    let response = await fetch("http://localhost:5000/api/v1/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("token") ?? "",
      },
      body: JSON.stringify({
        id: animeData["id"],
        english_name: animeData["english_title"],
        japanese_name: animeData["japanese_title"],
        image_url: animeData["backgroundImage"],
        total_episodes: animeData["episodeCount"],
        release_date: animeData["airedFrom"],
        release_type: animeData["type"],
        tag: tag,
      }),
    });
  };

  const handleClickEvent = (tag) => {
    addToWatchlist(tag);
  };

  const handleDropdownClick = (e) => {
    let dropdown = document.getElementById("watchlist-button-dropdown");
    if (dropdown?.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      if (dropdown) {
        dropdown.style.display = "block";
      }
    }
  };

  useEffect(() => {
    getAnime();
  }, []);

  return (
    <div className="anime">
      {animeData["coverImage"] === "" ? (
        <></>
      ) : (
        <img id="anime-cover-image" src={animeData["coverImage"]}></img>
      )}
      <div className="anime-card">
        <div className="anime-card-cover">
          <img src={animeData["backgroundImage"]} alt="anime cover" />
          <div className="watchlist-button">
            <button onClick={() => handleClickEvent("to watch")}>
              Add to Watchlist
            </button>
            <button onClick={handleDropdownClick}>▼</button>
            <div id="watchlist-button-dropdown">
              <button onClick={() => handleClickEvent("watching")}>
                Watching
              </button>
              <button onClick={() => handleClickEvent("completed")}>
                Completed
              </button>
              <button onClick={() => handleClickEvent("dropped")}>
                Dropped
              </button>
            </div>
          </div>
        </div>
        <div className="anime-card-textcontent">
          <div className="anime-card-titles">
            <h1>{animeData["japanese_title"]}</h1>
            <h2>{animeData["english_title"]}</h2>
            <p>{animeData["synopsis"]}</p>
          </div>
          <div className="anime-card-details">
            <p>
              Type: <em>{animeData["type"]}</em>
            </p>
            <p>Episodes: {animeData["episodeCount"]}</p>
            <p>
              Status: <em>{animeData["status"]}</em>
            </p>
            <p>Avg Ep: {animeData["duration"]}</p>
            <p>
              Aired: <em>{animeData["airedFrom"]}</em> to{" "}
              <em>{animeData["airedTo"]}</em>
            </p>
            <p>Studio: {animeData["studio"]}</p>
            <p>Genres: {animeData["genres"]}</p>
          </div>
        </div>
      </div>
      <h1>Trailer</h1>
      <div className="trailer-container">
        {animeData["trailer"] ? (
          playTrailer ? (
            <iframe
              width={560}
              height={315}
              src={animeData["trailer"]}
              title="Youtube Video Player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <div>
              <img src={animeData["trailerImage"]} alt="trailer" />
              <button onClick={() => setPlayTrailer(true)}>▶</button>
            </div>
          )
        ) : (
          <p>No trailer available</p>
        )}
      </div>
      {episodes ? (
        <>
          <h1>Episodes</h1>
          <div className="episode-container">
            {episodes.map((episode) => (
              <div key={episode["id"]} className="episode-card">
                {episode["thumbnail"] === "" ? (
                  <img
                    src={animeData["coverImage"]}
                    alt={"episode " + episode["number"]}
                  />
                ) : (
                  <img
                    src={episode["thumbnail"]}
                    alt={"episode " + episode["number"]}
                  />
                )}
                {episode["tite"] === "" ? (
                  <div className="episode-card-details">
                    <h1>{"episode" + episode["number"]}</h1>
                    <div className="episode-card-info">
                      <p>Episode {episode["number"]}</p>
                    </div>
                  </div>
                ) : (
                  <div className="episode-card-details">
                    <h1>{episode["title"]}</h1>
                    <div className="episode-card-info">
                      <p>Episode {episode["number"]}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No episodes available</p>
      )}
    </div>
  );
};

export default Anime;
