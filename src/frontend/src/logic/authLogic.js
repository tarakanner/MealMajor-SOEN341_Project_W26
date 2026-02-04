// Authentication business logic - separate from UI
// Handles all authentication operations and state management

const STORAGE_KEY = "user";
const API_BASE_URL = "http://localhost:3001/api";

// Local storage utilities
export const storageUtils = {
  getUser: () => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.warn("Invalid user data in localStorage, clearing:", error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  setUser: (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Validation utilities
export const validationUtils = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    return password && password.length >= 6;
  },

  validatePasswordMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },
};

// Authentication API calls
export const authAPI = {
  login: async (email, password) => {
    try {
      // TODO: Replace with actual backend API call
      console.log("API Login request:", { email, password });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API response
      const response = {
        success: true,
        user: {
          id: Date.now(),
          email: email,
          token: "fake-jwt-token",
          isAuthenticated: true,
        },
      };

      return response;
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  signup: async (email, password) => {
    try {
      // TODO: Replace with actual backend API call
      console.log("API Signup request:", { email, password });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API response
      const response = {
        success: true,
        user: {
          id: Date.now(),
          email: email,
          token: "fake-jwt-token",
          isAuthenticated: true,
          isNewUser: true,
        },
      };

      return response;
    } catch (error) {
      throw new Error("Signup failed: " + error.message);
    }
  },

  logout: async () => {
    try {
      // TODO: Make API call to invalidate session on backend
      console.log("API Logout request");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  },
};

// Authentication business logic
export const authLogic = {
  // Handle login process
  handleLogin: async (email, password) => {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!validationUtils.validateEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (!validationUtils.validatePassword(password)) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Make API call
    const response = await authAPI.login(email, password);

    if (response.success && response.user) {
      // Store user data
      storageUtils.setUser(response.user);
      return response.user;
    } else {
      throw new Error("Login failed");
    }
  },

  // Handle signup process
  handleSignup: async (email, password, confirmPassword) => {
    // Validate input
    if (!email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (!validationUtils.validateEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (!validationUtils.validatePassword(password)) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (!validationUtils.validatePasswordMatch(password, confirmPassword)) {
      throw new Error("Passwords do not match");
    }

    // Make API call
    const response = await authAPI.signup(email, password);

    if (response.success && response.user) {
      // Store user data
      storageUtils.setUser(response.user);
      return response.user;
    } else {
      throw new Error("Signup failed");
    }
  },

  // Handle logout process
  handleLogout: async () => {
    try {
      // Call API to invalidate session
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local data
      storageUtils.clearUser();
    }
  },

  // Get current user
  getCurrentUser: () => {
    return storageUtils.getUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = storageUtils.getUser();
    return user && user.isAuthenticated;
  },
};
