import React from "react";
import { Link } from "react-router-dom";
import "./TopNav.css";

function TopNav() {
  return (
    <div id="nav-pannel">
      {/*
      <a
        href="https://www.northeastern.edu"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick("NUtrition logo clicked")}
      >
        <img src="../public/NUtrition_logo.svg" alt="NUtrition logo" />
      </a>
      <a
        id="menu-icon"
        href="https://www.northeastern.edu"
        target="_blank"
        rel="noopener noreference"
        onClick={() =>
          handleClick(
            "menu handburger icon clicked, navigate to /settings when router set up"
          )
        }
      >
        <img src="../public/menubar_icon.svg" alt="NUtrition logo" />
      </a>

      */}
      <Link to="/" onClick={() => handleClick("home button clicked")}>
        <img src="../public/NUtrition_logo.svg" alt="NUtrition logo" />
      </Link>
      <Link to="/feedback">Feedback Form (tempporary)</Link>
      <Link
        to="/" // TO-DO!!
        onClick={() =>
          handleClick(
            "to menu page. to be implemented. currently routes to main page. "
          )
        }
      >
        <img src="../public/menubar_icon.svg" alt="NUtrition logo" />
      </Link>
    </div>
  );
}

export default TopNav;
