import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div id="footer">
      <Link to="/feedback">
        <p>Fill out our feedback form</p>
      </Link>
      <Link to="/">
        <p>thanks for using NUtrition!</p>
      </Link>
    </div>
  );
}

export default Footer;
