import React from "react";

import "./styles/profile.css";

const Profile = () => {
  const [username, setUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [joinDate, setJoinDate] = React.useState("");
  const [watchlistCount, setWatchlistCount] = React.useState(0);

  const [selectedComponent, setSelectedComponent] = React.useState("profile");
  const [error, setError] = React.useState("");

  const getProfile = async () => {
    let response = await fetch("http://localhost:5000/api/v1/user/profile", {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("token") ?? "",
      },
    });

    if (response.status === 200) {
      response = await response.json();
      setUsername(response["username"]);
      setDisplayName(response["display_name"] ?? response["username"]);
      setJoinDate(response["join_date"]);
      setWatchlistCount(response["watchlist_count"]);
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    let response = await fetch("http://localhost:5000/api/v1/user/profile", {
      method: "PUT",
      headers: {
        Authorization: sessionStorage.getItem("token") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target[0].value,
        display_name: event.target[1].value,
      }),
    });

    if (response.status === 200) {
      getProfile();
      setError("updated");
    }

    if (
      response.status === 403 ||
      response.status === 404 ||
      response.status === 500 ||
      response.status === 400
    ) {
      setError(await response.text());
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/logout", {
        method: "POST",
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      });

      if (response.status === 200) {
        sessionStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src="icons/profile.png"></img>
        <h1>{displayName}</h1>
        <div className="profile-facts">
          <p>Join Date:</p>
          <p>{joinDate}</p>
        </div>
        <div className="profile-facts">
          <p>Watchlist Count:</p>
          <p>{watchlistCount}</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="profile-form-container">
        <div className="profile-form-header">
          <button onClick={() => handleComponentChange("profile")}>
            🏠 Profile
          </button>
          <button onClick={() => handleComponentChange("settings")}>
            ⚙ Settings
          </button>
        </div>
        {selectedComponent === "profile" && (
          <div className="profile-form">
            <form onSubmit={updateProfile}>
              <label>Username:</label>
              <input type="text" defaultValue={username}></input>
              <label>Display Name</label>
              <input type="text" defaultValue={displayName}></input>
              <a href="change-password">🔑 Change password</a>
              <button type="submit">Update</button>
            </form>
            <p>{error}</p>
          </div>
        )}
        {selectedComponent === "settings" && (
          <div className="settings-menu">
            <div>
              <label>Dark Mode</label>
              <input type="checkbox"></input>
            </div>
            <div>
              <label>Site Primary Colour</label>
              <input type="color"></input>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
