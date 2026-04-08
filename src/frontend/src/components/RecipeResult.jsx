import React, { useState } from "react";
import PropTypes from "prop-types";

function RecipeResult({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <>
      {recipes.length == 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No recipes found :( Try another search ;)
        </p>
      ) : (
        <>
          <div className="recipe-results-grid">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id || index}
                className="recipe-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <h3 className="recipe-name">{recipe.name}</h3>
                <p>
                  <strong>Prep Time:</strong> {recipe.preparationTime || recipe.prepTime || "N/A"}
                </p>
                <p>
                  <strong>Cost:</strong> ${typeof recipe.cost === "number" ? recipe.cost : (recipe.cost || "N/A").replace(/^\$?/, "")}
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
              <div className="recipe-card" onClick={(e) => e.stopPropagation()}>
                <button
                  className="close-button"
                  onClick={() => setSelectedRecipe(null)}
                >
                  x
                </button>

                <h2 className="recipe-name">{selectedRecipe.name}</h2>

                <p>
                  <strong>Preparation Time: </strong>
                  {selectedRecipe.preparationTime || selectedRecipe.prepTime || "N/A"}
                </p>
                <p>
                  <strong>Cost:</strong> ${typeof selectedRecipe.cost === "number" ? selectedRecipe.cost : (selectedRecipe.cost || "N/A").replace(/^\$?/, "")}
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedRecipe.difficulty}
                </p>
                <p>
                  <strong>Dietary Tags: </strong>
                  {Array.isArray(selectedRecipe.dietaryTags) && selectedRecipe.dietaryTags.length
                    ? selectedRecipe.dietaryTags.join(", ")
                    : "None"}
                </p>

                <div>
                  <h4>Ingredients</h4>
                  <ul>
                    {Array.isArray(selectedRecipe.ingredients)
                      ? selectedRecipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))
                      : <li>None</li>}
                  </ul>
                </div>

                <div>
                  <h4>Preparation Steps</h4>
                  <ol>
                    {(Array.isArray(selectedRecipe.preparationSteps)
                      ? selectedRecipe.preparationSteps
                      : Array.isArray(selectedRecipe.steps)
                        ? selectedRecipe.steps
                        : []).map((step, i) => (
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

RecipeResult.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default RecipeResult;
