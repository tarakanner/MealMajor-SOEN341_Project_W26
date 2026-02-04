import React from "react";
/* useLocation learned from https://reactrouter.com/api/hooks/useLocation */
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <nav className="navbar">
        <div>
          <h2 style={{ paddingLeft: "10px" }}>MealMajor</h2>
        </div>
        <div className="nav-buttons-div">
          {path === "/" && (
            <>
              <Link to="/auth">
                <button className="blue_button">Login</button>
              </Link>
              <Link to="/">
                <button className="blue_button">Home</button>
              </Link>
            </>
          )}

          {path === "/auth" && (
            <Link to="/">
              <button className="blue_button">Home</button>
            </Link>
          )}

          {path === "/userpage" && (
            <>
              <Link to="/profile">
                <button className="blue_button">Profile</button>
              </Link>
              <Link to="/">
                <button className="blue_button">LogOut</button>
              </Link>
            </>
          )}

          {path === "/profile" && (
            <Link to="/userpage">
              <button className="blue_button">Home</button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
