import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  const heroStyle = {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "2rem",
  };

  const featureStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  const buttonStyle = {
    backgroundColor: "#4d8fd9",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "1rem",
  };

  const authButtonsStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "10px",
    zIndex: 1000,
  };

  const authButtonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
  };

  const loginButtonStyle = {
    ...authButtonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const signupButtonStyle = {
    ...authButtonStyle,
    backgroundColor: "#28a745",
    color: "white",
  };

  return (
    <div>
      {/* Auth buttons in corner - only show when not logged in */}
      {!user && (
        <div style={authButtonsStyle}>
          <Link to="/auth?mode=login" style={loginButtonStyle}>
            Login
          </Link>
          <Link to="/auth?mode=signup" style={signupButtonStyle}>
            Sign Up
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section style={heroStyle}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#333" }}>
          Welcome to MealMajor
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>
          Your personal meal planning and recipe management platform
        </p>
        {user ? (
          <Link to="/profile" style={buttonStyle}>
            Go to Your Profile
          </Link>
        ) : (
          <Link to="/auth" style={buttonStyle}>
            Get Started
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section style={featureStyle}>
        <div style={cardStyle}>
          <h3 style={{ color: "#4d8fd9", marginBottom: "1rem" }}>
            🍽️ Meal Planning
          </h3>
          <p>
            Plan your weekly meals with ease. Organize breakfast, lunch, and
            dinner for the entire week.
          </p>
          {user && (
            <Link to="/profile" style={buttonStyle}>
              Manage Meals
            </Link>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#4d8fd9", marginBottom: "1rem" }}>
            👤 Personal Profile
          </h3>
          <p>
            Set your dietary preferences, allergies, and restrictions for
            personalized meal suggestions.
          </p>
          {user ? (
            <Link to="/profile" style={buttonStyle}>
              Update Profile
            </Link>
          ) : (
            <Link to="/auth" style={buttonStyle}>
              Create Profile
            </Link>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "#4d8fd9", marginBottom: "1rem" }}>
            📱 Easy Access
          </h3>
          <p>
            Access your meal plans and preferences from any device, anywhere,
            anytime.
          </p>
          {user ? (
            <span style={{ color: "#28a745", fontWeight: "500" }}>
              ✓ You're all set!
            </span>
          ) : (
            <Link to="/auth" style={buttonStyle}>
              Join Now
            </Link>
          )}
        </div>
      </section>

      {user && (
        <section style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            Welcome back, {user.email}!
          </h2>
          <p style={{ color: "#666" }}>
            Ready to plan your next delicious meal?
          </p>
        </section>
      )}
    </div>
  );
}
