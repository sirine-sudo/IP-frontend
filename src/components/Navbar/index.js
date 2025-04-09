import React, { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css";
import { logoutUser } from "../../api/userApi";
import logo from "../../assets/images/logo/logo-light-mode.png";
import { ShoppingCart, CloudUpload, Users, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 🔥 Récupère le rôle

  const handleLogout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to="/dashboard" className="navbar-logo">
          <img src={logo} alt="Logo" />
          <h1>IP Management</h1>
        </NavLink>

        <div className="nav-links">
          {role === "admin" ? (
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active-link" : "")}>
              <Users size={18} style={{ marginRight: "5px" }} />
              Liste des Utilisateurs
            </NavLink>
          ) : (
            <>
              <NavLink to="/marketplace" className={({ isActive }) => (isActive ? "active-link" : "")}>
                <ShoppingCart size={18} style={{ marginRight: "5px" }} />
                Marketplace
              </NavLink>
              <NavLink to="/upload" className={({ isActive }) => (isActive ? "active-link" : "")}>
                <CloudUpload size={18} style={{ marginRight: "5px" }} />
                Uploader
              </NavLink>
            </>
          )}
          <NavLink to="/" onClick={handleLogout} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <LogOut size={18} style={{ marginRight: "5px" }} />
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
