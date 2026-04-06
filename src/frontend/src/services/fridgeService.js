const API_URL = "http://localhost:5000/api/fridge";

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
