const API_URL = `${typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/recipes`;

export async function getRecipes(userId) {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch recipes");
    return response.json();
}

export async function createRecipe(recipeData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
    });
    if (!response.ok) throw new Error("Failed to create recipe");
    return response.json();
}

export async function updateRecipe(id, recipeData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
    });
    if (!response.ok) throw new Error("Failed to update recipe");
    return response.json();
}

export async function deleteRecipe(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete recipe");
    return response.json();
}
