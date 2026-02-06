//for Backend: Please note that email regex verification won't be done here and will have to be implemented in the backend

import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(""); // for showing error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password minimum length check
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    // Check if passwords match
    if (password !== retypePassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
      await signup(email, password, userName);
      window.location.reload();
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Sign Up!</h1>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Retype Password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          required
        />

        <button type="submit">Create Account!</button>
      </form>
    </>
  );
}