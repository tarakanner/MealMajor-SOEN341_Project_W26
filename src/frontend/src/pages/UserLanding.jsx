import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserName } from "../services/authService";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

import { templateRecipes } from "../data/templateRecipes";
import RecipeResult from "../components/RecipeResult.jsx";

function LandingPage() {
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = getUserName();
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <>
      <div style={{ margin: "auto", width: "100%" }}>
        <SearchBar onSearch={(query) => navigate("/search")} />
        <br></br>
        <h2 style={{ textAlign: "center" }}>Welcome back {userName}!</h2>
        <h3 style={{ textAlign: "center" }}>
          These are the Recipes customized for you:
        </h3>

        <RecipeResult recipes={templateRecipes} />
      </div>
    </>
  );
}

export default LandingPage;

/**
 * <h4 style={{ textAlign: "center", color: "#4d8fd9" }}>
          This is where your info will go!
        </h4>
        <h4 style={{ textAlign: "center" }}>
          We're glad you've joined our <br />
          <br />
          <span style={{ fontWeight: "bold", color: "#4d8fd9" }}>AMAZING</span>
          <br /> <br /> meal management service!{" "}
        </h4>

        <br />
        <div
          className="auth-form"
          style={{
            textAlign: "center",
          }}
        >
          <Link to="/userpage">
            <button
              style={{
                fontSize: "19px",
                fontWeight: "bold",
                padding: "15px 25px",
              }}
            >
              Fun Button
            </button>
          </Link>
 */
