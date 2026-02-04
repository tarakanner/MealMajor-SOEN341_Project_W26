import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { authLogic } from "../logic/authLogic";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user state from storage
    const initializeUser = () => {
      const currentUser = authLogic.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    const userData = await authLogic.handleLogin(email, password);
    setUser(userData);
    return userData;
  };

  const signup = async (email, password, confirmPassword) => {
    const userData = await authLogic.handleSignup(
      email,
      password,
      confirmPassword,
    );
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authLogic.handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear user state even if API call fails
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return authLogic.isAuthenticated();
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
