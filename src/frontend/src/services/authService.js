import { getAPIUrl } from "../config.js";

// Dispatch custom event when auth state changes
function dispatchAuthChange() {
  window.dispatchEvent(new Event("authStateChanged"));
}

export async function login(email, password, userName) {
    try {
        const response = await fetch(`${getAPIUrl("/api/auth")}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, userName })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        dispatchAuthChange();

        return {
            userId: data.userId,
            token: data.token,
            userName: data.userName
        };
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
}

export async function signup(email, password, userName) {
    try {
        const response = await fetch(`${getAPIUrl("/api/auth")}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, userName })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        localStorage.setItem("userName", data.userName);
        dispatchAuthChange();

        return {
            userId: data.userId,
            userName: data.userName
        };
    } catch (error) {
        console.error("Signup error:", error.message);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    dispatchAuthChange();
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUserName() {
    return localStorage.getItem("userName");
}