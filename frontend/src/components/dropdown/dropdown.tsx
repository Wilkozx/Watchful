import React from "react";
import "./styles/dropdown.css";

const Dropdown = ({ svg, onclickEvent, props }) => {
  let options = props.options;

  const toggleDropdown = () => {
    const dropdown = document.querySelector("#dropdown-content-" + props.name);
    dropdown?.classList.toggle("show");
  };

  const handleDropdownClick = (e) => {
    toggleDropdown();
  };

  const handleOptionClick = (e) => {
    onclickEvent(e.target.innerText.toLowerCase());
  };

  return (
    <div className="dropdown" onClick={handleDropdownClick}>
      {svg}
      <ul className="dropdown-content" id={"dropdown-content-" + props.name}>
        {options.map((option) => {
          return (
            <li key={option} onClick={handleOptionClick}>
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
