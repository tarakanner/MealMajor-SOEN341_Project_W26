import React from "react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ margin: "auto", width: "100%" }} className="Landing-Page">
        <h2 style={{ textAlign: "center" }}>Welcome back User123!</h2>

        <h4 style={{ textAlign: "center", color: "#4d8fd9" }}>
          This is where your info will go!
        </h4>
        <h4 style={{ textAlign: "center" }}>
          {" "}
          We're glad you've joined our <br />
          <br />
          <span style={{ fontWeight: "bold", color: "#4d8fd9" }}>AMAZING</span>
          <br /> <br /> meal management servive!{" "}
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
              onClick={navigate("/recipes")}
            >
              view Recipes
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
