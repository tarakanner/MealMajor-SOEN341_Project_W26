import { getAPIUrl } from "../config.js";

export async function getMealPlan(userId) {
    const response = await fetch(`${getAPIUrl("/api/meal-plan")}?userId=${userId}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch meal plan");
    }
    return response.json();
}

export async function addOrUpdateMeal(userId, day, mealType, recipeId) {
    const response = await fetch(getAPIUrl("/api/meal-plan"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, day, mealType, recipeId }),
    });
    if (!response.ok) throw new Error("Failed to update meal plan");
    return response.json();
}

export async function deleteMeal(userId, mealId) {
    const response = await fetch(`${getAPIUrl("/api/meal-plan")}/${mealId}?userId=${userId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete meal");
    return response.json();
}
