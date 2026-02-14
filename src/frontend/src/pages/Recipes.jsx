import { useState } from "react";
import CreateRecipe from "../components/CreateRecipe";

export function Recipes({ recipes: recipesProp = [] }) {
  const [recipes, setRecipes] = useState(recipesProp);

  return (
    <div className="User-Page">
      <h1>Recipes</h1>

      <CreateRecipe
        onRecipeCreated={(recipe) => setRecipes((prev) => [recipe, ...prev])}
      />

      <div style={{ marginTop: "20px" }}>
        {recipes.length === 0 ? (
          <p>No recipes yet. Click “Create recipe” to add one.</p>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{
                padding: "14px",
                borderRadius: "8px",
                background: "#f8fbff",
                border: "1px solid #e6eef7",
                marginBottom: "12px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{recipe.title}</h2>

              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : null}

              <p>
                <strong>Difficulty:</strong> {recipe.difficulty}
              </p>
              {recipe.timeMinutes != null ? (
                <p>
                  <strong>Time:</strong> {recipe.timeMinutes} minutes
                </p>
              ) : null}
              {recipe.cost != null ? (
                <p>
                  <strong>Cost:</strong> ${recipe.cost}
                </p>
              ) : null}
              {recipe.dietaryTags?.length ? (
                <p>
                  <strong>Tags:</strong> {recipe.dietaryTags.join(", ")}
                </p>
              ) : null}

              <p>
                <strong>Ingredients:</strong>
                <br />
                {recipe.ingredients}
              </p>
              <p>
                <strong>Instructions:</strong>
                <br />
                {recipe.instructions}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
