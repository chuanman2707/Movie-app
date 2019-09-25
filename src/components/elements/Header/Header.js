import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="rmdb-header">
      <div className="rmdb-header-content">
        <Link to="/">
          <img
            src="./images/facebook_cover_photo_2.png"
            className="rmdb-logo"
            alt="logo"
          />
        </Link>
        <img
          src="./images/linkedin_profile_image.png"
          className="rmdb-tmdb-logo"
          alt="rmdb-tmdb logo"
        />
      </div>
    </div>
  );
};

export default Header;
