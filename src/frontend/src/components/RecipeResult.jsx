import { useState } from "react";

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
                  {selectedRecipe.preparationTime}
                </p>
                <p>
                  <strong>Cost:</strong> {selectedRecipe.cost}
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedRecipe.difficulty}
                </p>
                <p>
                  <strong>Dietary Tags: </strong>
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
