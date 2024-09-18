import React, { useEffect } from "react";
import "./styles/navbar.css";
import { useState } from "react";
import Dropdown from "../navbar/components/dropdown.tsx/dropdown.tsx";

export const Navbar = ({ search, onComponentChange }) => {
  const [query, setQuery] = useState("");

  // temp
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const getUsername = async () => {
    let response = await fetch("http://localhost:5000/api/v1/user/username", {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("token") ?? "",
      },
    });

    if (response.status === 200) {
      setUsername((await response.text()).toString());
      sessionStorage.setItem("username", username);
      setIsLogged(true);
    }

    if (response.status === 403) {
      setUsername("Guest");
      setIsLogged(false);
    }

    if (response.status === 500) {
      setUsername("Guest");
      setIsLogged(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComponentChange("search");
    search(query);
  };

  const handleLogoClick = () => {
    query && setQuery("");
    onComponentChange("home");
  };

  const handleProfileClick = () => {
    onComponentChange("profile");
  };

  useEffect(() => {
    getUsername();
  }, []);
  return (
    <nav>
      <div className="navbar-div" id="navbar-menu">
        {
          <Dropdown
            svg={
              <svg
                className="dropdown-svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  d="M4 18L20 18"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />{" "}
                <path
                  d="M4 12L20 12"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 6L20 6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onComponentChange={onComponentChange}
            props={{
              options: ["Home", "Genre", "Types", "Newest", "Ongoing", "Top"],
              name: "navigation",
            }}
          />
        }
        <h1 onClick={handleLogoClick}>
          Watch<em>ful</em>
        </h1>
      </div>
      <div className="navbar-div" id="navbar-searchbar">
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="navbar-div" id="navbar-profile">
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.04283 5.1757C8.59546 4.75121 9.24946 4.43224 10.0136 4.23441C10.0046 4.15752 10 4.0793 10 4C10 2.89543 10.8955 2 12 2C13.1046 2 14 2.89543 14 4C14 4.0793 13.9954 4.15752 13.9864 4.23441C14.7506 4.43224 15.4046 4.75121 15.9572 5.1757C16.933 5.92519 17.4981 6.93095 17.8325 7.93362C18.1644 8.92891 18.2842 9.96595 18.3426 10.8395C18.3663 11.1941 18.3806 11.5351 18.3932 11.8357L18.4018 12.0385C18.4175 12.3994 18.433 12.6684 18.4596 12.8673C18.6553 14.329 18.8982 15.3543 19.2438 16.1741C19.5816 16.9754 20.0345 17.6202 20.7071 18.2929C20.9931 18.5789 21.0787 19.009 20.9239 19.3827C20.7691 19.7564 20.4045 20 20 20H13.7325C13.9026 20.2942 14 20.6357 14 21C14 22.1046 13.1046 23 12 23C10.8955 23 10 22.1046 10 21C10 20.6357 10.0974 20.2942 10.2676 20H4.00003C3.59557 20 3.23093 19.7564 3.07615 19.3827C2.92137 19.009 3.00692 18.5789 3.29292 18.2929C3.96694 17.6189 4.4186 16.9787 4.75553 16.1809C5.1004 15.3642 5.3434 14.3395 5.54043 12.8673C5.56706 12.6684 5.58255 12.3994 5.59827 12.0385L5.60687 11.8357C5.61945 11.5351 5.63371 11.1941 5.65744 10.8395C5.7159 9.96595 5.83561 8.92891 6.16756 7.93362C6.50196 6.93095 7.06705 5.92519 8.04283 5.1757ZM6.06869 18C6.26568 17.6741 6.44135 17.3298 6.59797 16.959C7.04284 15.9056 7.31562 14.6803 7.52276 13.1327C7.56305 12.8316 7.58113 12.4756 7.59638 12.1255L7.60555 11.9095C7.61808 11.6105 7.63109 11.3002 7.65298 10.973C7.70745 10.159 7.81312 9.32109 8.06482 8.56638C8.31407 7.81905 8.6909 7.19981 9.26113 6.7618C9.82482 6.32883 10.6723 6 12 6C13.3278 6 14.1752 6.32883 14.7389 6.7618C15.3092 7.19981 15.686 7.81905 15.9352 8.56638C16.1869 9.32109 16.2926 10.159 16.3471 10.973C16.369 11.3002 16.382 11.6105 16.3945 11.9095L16.3945 11.9095L16.3945 11.9096L16.4037 12.1255C16.4189 12.4756 16.437 12.8316 16.4773 13.1327C16.6832 14.671 16.956 15.8957 17.4008 16.9509C17.5583 17.3244 17.735 17.6714 17.9334 18H6.06869Z"
            fill="#ffffff"
          />
        </svg>

        {isLogged && (
          <Dropdown
            svg={<img src="./icons/profile.png" alt="profile" />}
            onComponentChange={onComponentChange}
            props={{
              options: ["Profile", "Watchlist"],
              name: "profile",
            }}
          />
        )}

        {!isLogged && (
          <Dropdown
            svg={<img src="./icons/placeholder.png" alt="profile" />}
            onComponentChange={onComponentChange}
            props={{
              options: ["Login", "Register"],
              name: "profile",
            }}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;