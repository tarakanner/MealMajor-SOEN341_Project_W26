import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/authService";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Listen for auth state changes (login/logout)
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div>
        <h2 style={{ paddingLeft: "10px" }}>MealMajor</h2>
      </div>
      <div className="nav-buttons-div">
        {!isLoggedIn ? (
          <>
            <Link to="/">
              <button className="blue_button">Home</button>
            </Link>
            <Link to="/auth">
              <button className="blue_button">Login</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/userpage">
              <button className="blue_button">Home</button>
            </Link>
            <Link to="/recipes">
              <button className="blue_button">Recipes</button>
            </Link>
            <Link to="/planner">
              <button className="blue_button">Planner</button>
            </Link>
            <Link to="/fridge">
              <button className="blue_button">Fridge</button>
            </Link>
            <Link to="/grocery">
              <button className="blue_button">Grocery</button>
            </Link>
            <Link to="/profile">
              <button className="blue_button">Profile</button>
            </Link>
            <Link to="/">
              <button className="blue_button" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
