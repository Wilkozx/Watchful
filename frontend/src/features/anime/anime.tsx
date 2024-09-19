import React, { useEffect } from "react";
import "./styles/anime.css";

const Anime = ({ selectedComponent }) => {
  let id = selectedComponent.split(":")[1];
  const [episodes, setEpisodes] = React.useState([]);
  const [kitsuId, setKitsuId] = React.useState("");
  const [alternative, setAlternative] = React.useState(false);

  const [playTrailer, setPlayTrailer] = React.useState(false);

  // done
  const [animeCoverImage, setAnimeCoverImage] = React.useState("");
  const [backgroundImage, setBackgroundImage] = React.useState("");
  const [synopsis, setSynopsis] = React.useState("");
  const [youtubeId, setYoutubeId] = React.useState("");

  // redo
  const [englishName, setEnglishName] = React.useState("");
  const [japaneseName, setJapaneseName] = React.useState("");

  const [isAiring, setIsAiring] = React.useState(false);
  const [trailer, setTrailer] = React.useState("");
  const [trailerImage, setTrailerImage] = React.useState("");
  const [type, setType] = React.useState("");
  const [episodeCount, setEpisodeCount] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [airedFrom, setAiredFrom] = React.useState("");
  const [airedTo, setAiredTo] = React.useState("");
  const [season, setSeason] = React.useState("");
  const [studio, setStudio] = React.useState("");
  const [genres, setGenres] = React.useState("");
  const [aniListLink, setAniListLink] = React.useState("");

  const getAnime = async () => {
    let response = await fetch("http://localhost:5000/api/v1/anime/" + id, {
      method: "GET",
    });
    if (response.status === 404) {
      return;
    }

    if (response.status === 200) {
      let data = await response.json();
      setBackgroundImage(data["posterImage"] ?? "");
      setAnimeCoverImage(data["coverImage"] ?? "");
      setJapaneseName(data["canonicalTitle"] ?? "");
      setEnglishName(data["englishTitle"] ?? "");
      setSynopsis(data["synopsis"] ?? "");
      setTrailer(
        "https://www.youtube.com/embed/" +
          data["youtubeVideoId"] +
          "?enablejsapi=1&wmode=opaque&autoplay=1"
      );
      setTrailerImage(data["coverImage"]);
      setType(data["subtype"]);
      setEpisodeCount(data["episodeCount"]);
      setStatus(data["status"]);
      setAiredFrom(data["startDate"]);
      setAiredTo(data["endDate"]);
    }
  };

  const getEpisodes = async () => {
    let response = await fetch(
      "http://localhost:5000/api/v1/anime/" + id + "/episodes",
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      let data = await response.json();
      setEpisodes(data);
    }
  };

  const addToWatchlist = async () => {
    let response = await fetch("http://localhost:5000/api/v1/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("token") ?? "",
      },
      body: JSON.stringify({
        id: id,
        english_name: englishName,
        japanese_name: japaneseName,
        image_url: backgroundImage,
        total_episodes: episodeCount,
        release_date: airedFrom,
        release_type: type,
      }),
    });

    if (response.status === 200) {
      console.log("Added to watchlist");
    }
  };

  useEffect(() => {
    getAnime();
    getEpisodes();
  }, []);

  return (
    <div className="anime">
      <h1>{kitsuId}</h1>
      {animeCoverImage === "" ? (
        <></>
      ) : (
        <img id="anime-cover-image" src={animeCoverImage}></img>
      )}
      <div className="anime-card">
        <div className="anime-card-cover">
          <img src={backgroundImage} alt="anime cover" />
          <button onClick={addToWatchlist}>Add to Watchlist</button>
        </div>
        <div className="anime-card-textcontent">
          <div className="anime-card-titles">
            <h1>{japaneseName}</h1>
            <h2>{englishName}</h2>
            <p>{synopsis}</p>
          </div>
          <div className="anime-card-details">
            <p>
              Type: <em>{type}</em>
            </p>
            <p>Episodes: {episodeCount}</p>
            <p>
              Status: <em>{status}</em>
            </p>
            <p>Avg Ep: {duration}</p>
            <p>
              Aired: <em>{airedFrom}</em> to <em>{airedTo}</em>
            </p>
            <p>Studio: {studio}</p>
            <p>Genres: {genres}</p>
          </div>
        </div>
      </div>
      <h1>Trailer</h1>
      <div className="trailer-container">
        {trailer ? (
          playTrailer ? (
            <iframe
              width={560}
              height={315}
              src={trailer}
              title="Youtube Video Player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <div>
              <img src={trailerImage} alt="trailer" />
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
                    src={animeCoverImage}
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
