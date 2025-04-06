import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import CardContainer from "../CardContainer";
import { logoutUser } from "../../api/userApi";
import logo from "../../assets/images/logo/logo-light-mode.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logoutUser();
    navigate("/");
  }, [navigate]);

  return (
    <nav className="navbar">
      <CardContainer width="98%" height="8%" margin="10px" style={{ padding: "10px" }}>
        <div className="navbar-content">
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
            <img src={logo} alt="Logo" style={{ height: "60px" }} />
            <h2>IP Management</h2>
          </Link>

          <div className="nav-links">

            <Link to="/marketplace">Marketplace</Link>
            <Link to="/upload">Uploader</Link>
            <Link to="/audioLyricsEditor">Éditeur Audio/Lyrics</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </CardContainer>
    </nav>
  );
};

export default Navbar;
