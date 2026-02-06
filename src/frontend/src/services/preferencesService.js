const API_URL = "http://localhost:5000/api/preferences";

export async function getPreferences(userId) {
    try {
        const response = await fetch(`${API_URL}?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch preferences");
        }

        return data;
    } catch (error) {
        console.error("Get preferences error:", error.message);
        throw error;
    }
}

export async function createPreferences(userId, dietaryRestrictions, allergies, otherAllergy) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                dietaryRestrictions,
                allergies,
                otherAllergy
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create preferences");
        }

        return data;
    } catch (error) {
        console.error("Create preferences error:", error.message);
        throw error;
    }
}

export async function updatePreferences(userId, dietaryRestrictions, allergies, otherAllergy) {
    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                dietaryRestrictions,
                allergies,
                otherAllergy
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update preferences");
        }

        return data;
    } catch (error) {
        console.error("Update preferences error:", error.message);
        throw error;
    }
}