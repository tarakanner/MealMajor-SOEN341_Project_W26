import React from "react";
/* useLocation learned from https://reactrouter.com/api/hooks/useLocation */
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

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
              <Link to="/recipes">
                <button className="blue_button">My Recipes</button>
              </Link>
              <Link to="/grocery">
                <button className="blue_button">Grocery</button>
              </Link>
              <Link to="/fridge">
                <button className="blue_button">My Fridge</button>
              </Link>
              <Link to="/profile">
                <button className="blue_button">Profile</button>
              </Link>
              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}

          {path === "/search" && (
            <>
              <Link to="/recipes">
                <button className="blue_button">My Recipes</button>
              </Link>

              <Link to="/userpage">
                <button className="blue_button">Home</button>
              </Link>
              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}

          {path === "/recipes" && (
            <>
              <Link to="/planner">
                <button className="blue_button">Plan Week</button>
              </Link>
              <Link to="/fridge">
                <button className="blue_button">My Fridge</button>
              </Link>
              <Link to="/userpage">
                <button className="blue_button">Home</button>
              </Link>
              <Link to="/profile">
                <button className="blue_button">Profile</button>
              </Link>

              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}

          {path === "/profile" && (
            <Link to="/userpage">
              <button className="blue_button">Home</button>
            </Link>
          )}
          {path === "/userpage" && (
            <Link to="/planner">
              <button className="blue_button">Plan Week</button>
            </Link>
          )}
          {path === "/planner" && (
            <>
              <Link to="/recipes">
                <button className="blue_button">My Recipes</button>
              </Link>
              <Link to="/fridge">
                <button className="blue_button">My Fridge</button>
              </Link>
              <Link to="/userpage">
                <button className="blue_button">Home</button>
              </Link>
              <Link to="/grocery">
                <button className="blue_button">Grocery</button>
              </Link>
              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}
          {path === "/fridge" && (
            <>
              <Link to="/recipes">
                <button className="blue_button">My Recipes</button>
              </Link>
              <Link to="/planner">
                <button className="blue_button">Plan Week</button>
              </Link>
              <Link to="/grocery">
                <button className="blue_button">Grocery</button>
              </Link>
              <Link to="/userpage">
                <button className="blue_button">Home</button>
              </Link>
              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}
          {path === "/grocery" && (
            <>
              <Link to="/recipes">
                <button className="blue_button">My Recipes</button>
              </Link>

              <Link to="/fridge">
                <button className="blue_button">My Fridge</button>
              </Link>

              <Link to="/userpage">
                <button className="blue_button">Home</button>
              </Link>
              <Link to="/">
                <button className="blue_button" onClick={logout}>
                  LogOut
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
