import { useState } from "react";

function RecipeResult({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <>
      {recipes.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#b71c1c",
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          No recipes found{" "}
          <span role="img" aria-label="sad">
            😞
          </span>{" "}
          Try another search!
        </p>
      ) : (
        <>
          <div className="recipe-results-grid">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id || index}
                className="recipe-card"
                style={{
                  boxShadow: "0 2px 8px rgba(46,119,202,0.08)",
                  border: "1.5px solid #e3eaf2",
                  transition: "transform 0.1s",
                  background: "#f8fafc",
                }}
                onClick={() => setSelectedRecipe(recipe)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <h3 className="recipe-name" style={{ marginBottom: 8 }}>
                  {recipe.name}
                </h3>
                <p>
                  <strong>Prep Time:</strong> {recipe.preparationTime}
                </p>
                <p>
                  <strong>Cost:</strong> {recipe.cost}
                </p>
                <p>
                  <strong>Difficulty:</strong> {recipe.difficulty}
                </p>
              </div>
            ))}
          </div>

          {selectedRecipe && (
            <div
              className="recipe-card-display"
              onClick={() => setSelectedRecipe(null)}
            >
              <div
                className="recipe-card"
                style={{
                  background: "#fff",
                  border: "1.5px solid #2e77ca",
                  boxShadow: "0 4px 24px rgba(46,119,202,0.12)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-button"
                  onClick={() => setSelectedRecipe(null)}
                  style={{ color: "#2e77ca" }}
                >
                  ×
                </button>
                <h2 className="recipe-name">{selectedRecipe.name}</h2>
                <p>
                  <strong>Preparation Time: </strong>
                  {selectedRecipe.preparationTime}
                </p>
                <p>
                  <strong>Cost:</strong> {selectedRecipe.cost}
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedRecipe.difficulty}
                </p>
                <p>
                  <strong>Diet:</strong>{" "}
                  {selectedRecipe.dietaryTags.length
                    ? selectedRecipe.dietaryTags.join(", ")
                    : "None"}
                </p>
                <div>
                  <h4>Ingredients</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Preparation Steps</h4>
                  <ol>
                    {selectedRecipe.preparationSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default RecipeResult;
