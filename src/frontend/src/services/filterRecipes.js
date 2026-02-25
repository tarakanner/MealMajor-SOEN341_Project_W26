export function filterRecipes(recipes, search) {
    
  const query = search.trim().toLowerCase();

  return recipes.filter((recipe) => {
    const recipeText = [
      recipe.name,
      recipe.preparationTime,
      recipe.cost,
      recipe.difficulty,
      recipe.ingredients.join(" "),
      recipe.preparationSteps.join(" "),
      recipe.dietaryTags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return recipeText.includes(query);
  });
}