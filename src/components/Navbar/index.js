import React, { useCallback, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css";
import { logoutUser } from "../../api/userApi";
import logo from "../../assets/images/logo/logo-light-mode.png";
import { ShoppingCart, CloudUpload, Users, LogOut, UserSquare, Menu } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink
          to={role === "admin" ? "/admin/users" : "/dashboard"}
          className="navbar-logo nav-title"
        >
          <img src={logo} alt="Logo" />
          iP Management
        </NavLink>

        {isMobile && (
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        )}

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {role === "admin" ? (
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              <Users size={18} style={{ marginRight: "5px" }} />
              Liste des Utilisateurs
            </NavLink>
          ) : (
            <>
              <NavLink 
                to="/ttl-uploader" 
                className={({ isActive }) => (isActive ? "active-link" : "")} 
                style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}
                onClick={() => setMenuOpen(false)}
              >
                <UserSquare size={18} /> 
                TTL Uploader
              </NavLink>
              <NavLink 
                to="/my-ips" 
                className={({ isActive }) => (isActive ? "active-link" : "")} 
                style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}
                onClick={() => setMenuOpen(false)}
              >
                <UserSquare size={18} /> 
                Mes IPs
              </NavLink>
              <NavLink 
                to="/marketplace" 
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCart size={18} style={{ marginRight: "5px" }} />
                Marketplace
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => setMenuOpen(false)}
              >
                <CloudUpload size={18} style={{ marginRight: "5px" }} />
                Uploader
              </NavLink>
            </>
          )}
          <NavLink 
            to="/" 
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
              setMenuOpen(false);
            }} 
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <LogOut size={18} style={{ marginRight: "5px" }} />
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;