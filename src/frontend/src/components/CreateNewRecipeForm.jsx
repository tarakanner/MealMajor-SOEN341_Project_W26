import { useState } from "react";

export function CreateNewRecipeForm({ onSubmit, onCancel, initialValues }) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? "");
  const [ingredients, setIngredients] = useState(initialValues?.ingredients ?? "");
  const [instructions, setInstructions] = useState(
    initialValues?.instructions ?? "",
  );
  const [timeMinutes, setTimeMinutes] = useState(initialValues?.timeMinutes ?? "");
  const [cost, setCost] = useState(initialValues?.cost ?? "");
  const [difficulty, setDifficulty] = useState(initialValues?.difficulty ?? "Easy");
  const [dietaryTags, setDietaryTags] = useState(
    (initialValues?.dietaryTags ?? []).join(", "),
  );

  function handleSubmit(event) {
    event.preventDefault();

    const id =
      initialValues?.id ??
      (globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : String(Date.now()));

    const recipe = {
      id,
      title: title.trim(),
      image: imageUrl.trim(),
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      timeMinutes: timeMinutes === "" ? null : Number(timeMinutes),
      cost: cost === "" ? null : Number(cost),
      difficulty,
      dietaryTags: dietaryTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onSubmit?.(recipe);
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create a new recipe</h2>

      <input
        type="text"
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="url"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={4}
        required
      />

      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={5}
        required
      />

      <input
        type="number"
        placeholder="Time (minutes)"
        value={timeMinutes}
        onChange={(e) => setTimeMinutes(e.target.value)}
        min={0}
      />

      <input
        type="number"
        placeholder="Cost (optional)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        min={0}
        step="0.01"
      />

      <label htmlFor="difficulty">Difficulty</label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <input
        type="text"
        placeholder="Dietary tags (comma-separated)"
        value={dietaryTags}
        onChange={(e) => setDietaryTags(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit">Save recipe</button>
        <button
          type="button"
          onClick={onCancel}
          style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
