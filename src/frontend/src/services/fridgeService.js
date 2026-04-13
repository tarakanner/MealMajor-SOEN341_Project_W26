const API_URL = `${typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/fridge`;

export async function getFridge(userId) {
    try {
        const response = await fetch(`${API_URL}?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 404) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch fridge");
        }

        return data;
    } catch (error) {
        console.error("Get fridge error:", error.message);
        throw error;
    }
}

export async function getMissingIngredients(userId) {
    try {
        const response = await fetch(`${API_URL}/missing-ingredients?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get missing ingredients");
        }

        return data;
    } catch (error) {
        console.error("Get missing ingredients error:", error.message);
        throw error;
    }
}

export async function saveIngredients(userId, ingredients) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, ingredients })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save ingredients");
        }

        return data;
    } catch (error) {
        console.error("Save ingredients error:", error.message);
        throw error;
    }
}

export async function saveMissingIngredients(userId, missingIngredients) {
    try {
        const response = await fetch(`${API_URL}/missing-ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, missingIngredients })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to save missing ingredients");
        }

        return data;
    } catch (error) {
        console.error("Save missing ingredients error:", error.message);
        throw error;
    }
}
