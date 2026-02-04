import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navStyle = {
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "2px solid #e9ecef",
    marginBottom: "0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4d8fd9",
    textDecoration: "none",
  };

  const linkStyle = {
    marginLeft: "2rem",
    textDecoration: "none",
    color: "#666",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "all 0.2s",
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#4d8fd9",
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    marginLeft: "1rem",
  };

  const authLinksStyle = {
    marginLeft: "1rem",
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          🍽️ MealMajor
        </Link>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={location.pathname === "/" ? activeLinkStyle : linkStyle}
          >
            Home
          </Link>

          {user && (
            <Link
              to="/profile"
              style={
                location.pathname === "/profile" ? activeLinkStyle : linkStyle
              }
            >
              Profile
            </Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginLeft: "2rem", color: "#666" }}>
                Welcome, {user.email}!
              </span>
              <button onClick={handleLogout} style={buttonStyle}>
                Logout
              </button>
            </div>
          ) : (
            <div style={authLinksStyle}>
              <Link
                to="/auth"
                style={
                  location.pathname === "/auth" ? activeLinkStyle : linkStyle
                }
              >
                Login / Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
