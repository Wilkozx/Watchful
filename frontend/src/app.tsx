import React from "react";
import Navbar from "./features/navbar/navbar.tsx";
import Form from "./components/form/form.tsx";

import Profile from "./features/profile/profile.tsx";

import DisplayResults from "./features/displayResults/displayResults.tsx";
import Watchlist from "./features/watchlist/watchlist.tsx";
import Anime from "./features/anime/anime.tsx";

import { searchQuery } from "./services/searchQuery.tsx";
import "./index.css";

export const App = () => {
  const [selectedComponent, setSelectedComponent] = React.useState("home");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const search = async (query) => {
    try {
      const response = await searchQuery(`/api/v1/anime/search/${query}`);
      if (response === 404) {
        console.log("No results found");
        return;
      } else {
        setSearchResults(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar onComponentChange={handleComponentChange} search={search} />

      {selectedComponent === "search" && (
        <DisplayResults
          searchResults={searchResults}
          onComponentChange={handleComponentChange}
        />
      )}

      {selectedComponent.match("anime:") && (
        <Anime selectedComponent={selectedComponent} />
      )}

      {selectedComponent === "register" && (
        <Form
          url="http://localhost:5000/api/v1/user/register"
          method="POST"
          successFunction={async (response) => {
            console.log("success");
            sessionStorage.setItem("token", (await response.text()).toString());
            window.location.href = "/";
          }}
          name="Register"
          inputFields={[
            {
              id: "username",
              name: "username",
              type: "text",
              placeholder: "👤 Username",
            },
            {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "🔒 Password",
            },
          ]}
          extraButtons={
            <button
              onClick={() => {
                handleComponentChange("login");
              }}
            >
              Login
            </button>
          }
        />
      )}

      {selectedComponent === "login" && (
        <Form
          url="http://localhost:5000/api/v1/user/login"
          method="POST"
          successFunction={async (response) => {
            console.log("success");
            sessionStorage.setItem("token", (await response.text()).toString());
            window.location.href = "/";
          }}
          name="Login"
          inputFields={[
            {
              id: "username",
              name: "username",
              type: "text",
              placeholder: "👤 Username",
            },
            {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "🔒 Password",
            },
          ]}
          extraButtons={
            <button
              onClick={() => {
                handleComponentChange("register");
              }}
            >
              Register
            </button>
          }
        />
      )}

      {selectedComponent === "profile" && <Profile />}

      {selectedComponent === "watchlist" && (
        <Watchlist onComponentChange={handleComponentChange} />
      )}
    </>
  );
};

export default App;
