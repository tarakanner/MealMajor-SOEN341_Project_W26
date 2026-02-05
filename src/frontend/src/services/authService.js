const API_URL = "http://localhost:5000/api/auth"; 

export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        return {
            userId: data.userId,
            token: data.token
        };
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
}

export async function signup(email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        return {
            userId: data.userId
        };
    } catch (error) {
        console.error("Signup error:", error.message);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
}

export function getToken() {
    return localStorage.getItem("token");
}
