import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <div style={{ margin: "auto", width: "100%" }} className="Landing-Page">
        <h2 style={{ textAlign: "center" }}>Welcome to MealMajor!</h2>

        <h4 style={{ textAlign: "center", color: "#4d8fd9" }}>
          Create a meal plan that's tailor made for you!
        </h4>
        <h4 style={{ textAlign: "center" }}>
          {" "}
          Login or Create an Account to get started with out <br />
          <br />
          <span style={{ fontWeight: "bold", color: "#4d8fd9" }}>FREE</span>
          <br /> <br /> meal management servive!{" "}
        </h4>

        <br />
        <div
          className="auth-form"
          style={{
            textAlign: "center",
          }}
        >
          <Link to="/auth">
            <button
              style={{
                fontSize: "19px",
                fontWeight: "bold",
                padding: "15px 25px",
              }}
            >
              Start Today
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
