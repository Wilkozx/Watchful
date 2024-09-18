import React, { useEffect } from "react";
import "./styles/anime.css";

const Anime = ({ selectedComponent }) => {
  let id = selectedComponent.split(":")[1];

  const [playTrailer, setPlayTrailer] = React.useState(false);

  const [animeCoverImage, setAnimeCoverImage] = React.useState("");
  const [englishName, setEnglishName] = React.useState("");
  const [japaneseName, setJapaneseName] = React.useState("");
  const [backgroundImage, setBackgroundImage] = React.useState("");
  const [synopsis, setSynopsis] = React.useState("");
  const [isAiring, setIsAiring] = React.useState(false);
  const [trailer, setTrailer] = React.useState("");
  const [trailerImage, setTrailerImage] = React.useState("");
  const [type, setType] = React.useState("");
  const [episodes, setEpisodes] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [airedFrom, setAiredFrom] = React.useState("");
  const [airedTo, setAiredTo] = React.useState("");
  const [season, setSeason] = React.useState("");
  const [studio, setStudio] = React.useState("");
  const [genres, setGenres] = React.useState("");
  const [aniListLink, setAniListLink] = React.useState("");

  const getAnime = async () => {
    let response = await fetch(
      "http://localhost:5000//api/v1/anime/get/" + id,
      {
        method: "GET",
      }
    );
    if (response.status === 404) {
      return;
    }

    if (response.status === 200) {
      let data = await response.json();
      if (data.data === undefined) {
        setEnglishName("No data found retry");
        return;
      }
      setEnglishName(
        data.data["title_synonyms"][0] || data.data["title_english"]
      );
      setJapaneseName(data.data["title"].replaceAll('"', ""));
      setBackgroundImage(data.data["images"]["jpg"]["large_image_url"]);
      setSynopsis(data.data["synopsis"]);
      setIsAiring(data.data["is_airing"]);
      setTrailer(data.data["trailer"].embed_url);
      setTrailerImage(data.data["trailer"]["images"]["maximum_image_url"]);
      setType(data.data["type"]);
      setEpisodes(data.data["episodes"]);
      setStatus(data.data["status"]);
      setDuration(data.data["duration"].replace("per ep", ""));
      setAiredFrom(data.data["aired"]["from"].replace("T00:00:00+00:00", ""));
      setAiredTo(data.data["aired"]["to"].replace("T00:00:00+00:00", ""));
      setSeason(data.data["season"]);
      setStudio(data.data["studios"][0]["name"]);
      setAniListLink(data.data["url"]);
    }
  };

  const getCoverImage = async () => {
    let response = await fetch(
      "http://localhost:5000/api/v1/anime/background/" + japaneseName ||
        englishName,
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      let data = await response.json();
      setAnimeCoverImage(data["cover_image"]);
    }
  };

  useEffect(() => {
    getAnime();
  }, []);

  useEffect(() => {
    getCoverImage();
  }, [japaneseName]);

  return (
    <div className="anime">
      <img id="anime-cover-image" src={animeCoverImage}></img>
      <div className="anime-card">
        <img src={backgroundImage} alt="anime cover" />
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
            <p>Episodes: {episodes}</p>
            <p>
              Status: <em>{status}</em>
            </p>
            <p>Avg Ep: {duration}</p>
            <p>
              Aired: <em>{airedFrom}</em> to <em>{airedTo}</em>
            </p>
            <p>Studio: {studio}</p>
            <p>Genres: {genres}</p>
            <p>
              Anilist:{" "}
              <a href={aniListLink}>
                <em>Link</em>
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="trailer-container">
        {trailer ? (
          playTrailer ? (
            <iframe
              width={560}
              height={315}
              src={trailer}
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
    </div>
  );
};

export default Anime;