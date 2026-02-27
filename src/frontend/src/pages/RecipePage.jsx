import { useState, useEffect, useCallback } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "../services/recipeService";

const DIETARY_TAG_OPTIONS = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Nut-Free", "High-Protein", "Meal-Prep"];
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

const emptyForm = {
    name: "",
    ingredients: [""],
    prepTime: "",
    steps: [""],
    cost: "",
    difficulty: "easy",
    dietaryTags: [],
};

export default function RecipePage() {
    const [recipes, setRecipes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [confirmation, setConfirmation] = useState("");
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    const fetchRecipes = useCallback(async () => {
        try {
            const data = await getRecipes(userId);
            setRecipes(data);
        } catch {
            setError("Failed to load recipes.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            setError("You must be logged in to manage recipes.");
            setLoading(false);
            return;
        }
        fetchRecipes();
    }, [userId, fetchRecipes]);

    function showConfirmation(msg) {
        setConfirmation(msg);
        setTimeout(() => setConfirmation(""), 3000);
    }

    function openCreate() {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    }

    function openEdit(recipe) {
        setForm({
            name: recipe.name,
            ingredients: recipe.ingredients.length ? recipe.ingredients : [""],
            prepTime: recipe.prepTime,
            steps: recipe.steps.length ? recipe.steps : [""],
            cost: recipe.cost !== undefined ? String(recipe.cost) : "",
            difficulty: recipe.difficulty,
            dietaryTags: recipe.dietaryTags || [],
        });
        setEditingId(recipe._id);
        setShowForm(true);
    }

    function cancelForm() {
        setShowForm(false);
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            userId,
            name: form.name,
            ingredients: form.ingredients.filter((i) => i.trim()),
            prepTime: form.prepTime,
            steps: form.steps.filter((s) => s.trim()),
            cost: parseFloat(form.cost) || 0,
            difficulty: form.difficulty,
            dietaryTags: form.dietaryTags,
        };
        try {
            if (editingId) {
                const updated = await updateRecipe(editingId, payload);
                setRecipes((prev) => prev.map((r) => (r._id === editingId ? updated : r)));
                showConfirmation("Recipe updated successfully!");
            } else {
                const created = await createRecipe(payload);
                setRecipes((prev) => [...prev, created]);
                showConfirmation("Recipe created successfully!");
            }
            setShowForm(false);
            setEditingId(null);
        } catch {
            setError("Failed to save recipe.");
        }
    }

    async function handleDelete(id) {
        try {
            await deleteRecipe(id);
            setRecipes((prev) => prev.filter((r) => r._id !== id));
            setDeleteTargetId(null);
            showConfirmation("Recipe deleted successfully!");
        } catch {
            setError("Failed to delete recipe.");
        }
    }

    function updateListItem(field, index, value) {
        setForm((prev) => {
            const arr = [...prev[field]];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    }

    function addListItem(field) {
        setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    }

    function removeListItem(field, index) {
        setForm((prev) => {
            const arr = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: arr.length ? arr : [""] };
        });
    }

    function toggleDietaryTag(tag) {
        setForm((prev) => {
            const tags = prev.dietaryTags.includes(tag)
                ? prev.dietaryTags.filter((t) => t !== tag)
                : [...prev.dietaryTags, tag];
            return { ...prev, dietaryTags: tags };
        });
    }

    return (
        <div className="recipe-page">
            <h2 className="recipe-page-title">My Recipes</h2>

            {confirmation && <div className="recipe-confirmation">{confirmation}</div>}
            {error && <div className="recipe-error">{error}</div>}

            {!showForm && (
                <button className="blue_button recipe-add-btn" onClick={openCreate}>
                    + Add New Recipe
                </button>
            )}

            {showForm && (
                <div className="recipe-form-overlay" onClick={cancelForm}>
                    <div className="recipe-form-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={cancelForm}>x</button>
                        <h3>{editingId ? "Edit Recipe" : "New Recipe"}</h3>
                        <form className="recipe-form" onSubmit={handleSubmit}>
                            <label>Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />

                            <label>Ingredients</label>
                            {form.ingredients.map((ing, i) => (
                                <div key={i} className="recipe-list-row">
                                    <input
                                        type="text"
                                        value={ing}
                                        placeholder={`Ingredient ${i + 1}`}
                                        onChange={(e) => updateListItem("ingredients", i, e.target.value)}
                                    />
                                    <button type="button" className="recipe-remove-btn" onClick={() => removeListItem("ingredients", i)}>-</button>
                                </div>
                            ))}
                            <button type="button" className="recipe-add-item-btn" onClick={() => addListItem("ingredients")}>+ Add Ingredient</button>

                            <label>Preparation Time</label>
                            <input
                                type="text"
                                value={form.prepTime}
                                placeholder="e.g. 30 minutes"
                                onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                            />

                            <label>Preparation Steps</label>
                            {form.steps.map((step, i) => (
                                <div key={i} className="recipe-list-row">
                                    <input
                                        type="text"
                                        value={step}
                                        placeholder={`Step ${i + 1}`}
                                        onChange={(e) => updateListItem("steps", i, e.target.value)}
                                    />
                                    <button type="button" className="recipe-remove-btn" onClick={() => removeListItem("steps", i)}>-</button>
                                </div>
                            ))}
                            <button type="button" className="recipe-add-item-btn" onClick={() => addListItem("steps")}>+ Add Step</button>

                            <label>Cost ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.cost}
                                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                            />

                            <label>Difficulty</label>
                            <select
                                value={form.difficulty}
                                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                            >
                                {DIFFICULTY_OPTIONS.map((d) => (
                                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                                ))}
                            </select>

                            <label>Dietary Tags</label>
                            <div className="recipe-tags-group">
                                {DIETARY_TAG_OPTIONS.map((tag) => (
                                    <label key={tag} className="recipe-tag-label">
                                        <input
                                            type="checkbox"
                                            checked={form.dietaryTags.includes(tag)}
                                            onChange={() => toggleDietaryTag(tag)}
                                        />
                                        {tag}
                                    </label>
                                ))}
                            </div>

                            <div className="recipe-form-actions">
                                <button type="submit" className="blue_button">{editingId ? "Save Changes" : "Create Recipe"}</button>
                                <button type="button" className="recipe-cancel-btn" onClick={cancelForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTargetId && (
                <div className="recipe-form-overlay" onClick={() => setDeleteTargetId(null)}>
                    <div className="recipe-confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <p>Are you sure you want to delete this recipe?</p>
                        <div className="recipe-form-actions">
                            <button className="recipe-delete-btn" onClick={() => handleDelete(deleteTargetId)}>Delete</button>
                            <button className="recipe-cancel-btn" onClick={() => setDeleteTargetId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: "center" }}>Loading recipes...</p>
            ) : recipes.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}>No recipes yet. Add your first one!</p>
            ) : (
                <div className="recipe-results-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card recipe-card-manage">
                            <h3 className="recipe-name">{recipe.name}</h3>
                            <p><strong>Prep Time:</strong> {recipe.prepTime || "—"}</p>
                            <p><strong>Cost:</strong> ${recipe.cost}</p>
                            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                            {recipe.dietaryTags.length > 0 && (
                                <p><strong>Tags:</strong> {recipe.dietaryTags.join(", ")}</p>
                            )}
                            <div className="recipe-card-actions">
                                <button className="blue_button" onClick={() => openEdit(recipe)}>Edit</button>
                                <button className="recipe-delete-btn" onClick={() => setDeleteTargetId(recipe._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
