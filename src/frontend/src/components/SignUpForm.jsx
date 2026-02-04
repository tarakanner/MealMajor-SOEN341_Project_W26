// SignUp Form UI Component - purely presentational
// Business logic handled in authLogic.js

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useFormState, FormError, LoadingButton } from "../utils/formUtils.jsx";

export default function SignupForm() {
  const { signup } = useAuth();
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
    retypePassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);

    try {
      await signup(values.email, values.password, values.retypePassword);
      navigate("/profile");
    } catch (error) {
      setError("general", error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1>Sign Up!</h1>

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

      <input
        type="password"
        placeholder="Retype Password"
        value={values.retypePassword}
        onChange={handleChange("retypePassword")}
        disabled={isLoading}
        required
      />
      <FormError error={errors.retypePassword} />

      <LoadingButton type="submit" isLoading={isLoading}>
        Create Account!
      </LoadingButton>
    </form>
  );
}
