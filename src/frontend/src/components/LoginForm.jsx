// Login Form UI Component - purely presentational
// Business logic handled in authLogic.js

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useFormState, FormError, LoadingButton } from "../utils/formUtils.jsx";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    values,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    setError,
    clearErrors,
  } = useFormState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);

    try {
      await login(values.email, values.password);
      navigate("/profile");
    } catch (error) {
      setError("general", error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1>Login</h1>

      <FormError error={errors.general} />

      <input
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange("email")}
        disabled={isLoading}
        required
      />
      <FormError error={errors.email} />

      <input
        type="password"
        placeholder="Password"
        value={values.password}
        onChange={handleChange("password")}
        disabled={isLoading}
        required
      />
      <FormError error={errors.password} />

      <LoadingButton type="submit" isLoading={isLoading}>
        Login
      </LoadingButton>
    </form>
  );
}
