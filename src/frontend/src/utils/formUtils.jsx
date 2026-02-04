// UI utilities for form handling
// Reusable form state and UI logic

import { useState } from "react";

// Custom hook for form state management
export const useFormState = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const setError = (field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setIsLoading(false);
  };

  return {
    values,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    setError,
    clearErrors,
    reset,
  };
};

// Form validation UI feedback
export const FormError = ({ error }) => {
  if (!error) return null;

  return (
    <p
      style={{
        color: "crimson",
        fontSize: "14px",
        marginTop: "5px",
        marginBottom: "10px",
      }}
    >
      {error}
    </p>
  );
};

// Loading button component
export const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      style={{
        ...props.style,
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? "not-allowed" : "pointer",
      }}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

// Success message component
export const SuccessMessage = ({ message, show }) => {
  if (!show || !message) return null;

  return (
    <div
      style={{
        color: "green",
        backgroundColor: "#d4edda",
        padding: "10px",
        borderRadius: "4px",
        marginBottom: "15px",
        border: "1px solid #c3e6cb",
      }}
    >
      {message}
    </div>
  );
};
