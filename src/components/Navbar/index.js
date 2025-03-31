import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import CardContainer from "../CardContainer";

const Navbar = () => {
  return (
    <nav className="navbar">
      <CardContainer width="98%" height="8%" margin="10px" style={{ padding: "10px" }}>
        <div className="navbar-content">
          <h2>Mon Application</h2>
          <div className="nav-links">
            <Link to="/">Accueil</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/upload">Uploader</Link>
            <Link to="/audioLyricsEditor">Éditeur Audio/Lyrics</Link>

          </div>
        </div>
      </CardContainer>
    </nav>
  );
};

export default Navbar;
