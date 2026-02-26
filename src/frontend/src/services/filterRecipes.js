export function filterRecipes(
  recipes,
  search = "",
  prepTime = "",
  difficulty = "",
  cost = "",
  dietaryTags = []
) {
  const query = search.trim().toLowerCase();
  return recipes.filter((recipe) => {
    // Search filter
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
    if (query && !recipeText.includes(query)) return false;

    // Prep time filter
    if (prepTime) {
      let mins = 0;
      const timeStr = recipe.preparationTime.toLowerCase();
      const hourMatch = timeStr.match(/(\d+)\s*hour/);
      const minMatch = timeStr.match(/(\d+)\s*min/);
      if (hourMatch) mins += parseInt(hourMatch[1], 10) * 60;
      if (minMatch) mins += parseInt(minMatch[1], 10);
      if (prepTime === "lt30" && !(mins < 30)) return false;
      if (prepTime === "lt60" && !(mins < 60)) return false;
      if (prepTime === "gt60" && !(mins > 60)) return false;
    }

    // Difficulty filter
    if (difficulty && recipe.difficulty !== difficulty) return false;

    // Cost filter
    if (cost) {
      let recipeCostNum = 0;
      if (typeof recipe.cost === "number") {
        recipeCostNum = recipe.cost;
      } else if (typeof recipe.cost === "string") {
        const match = recipe.cost.match(/\d+/);
        recipeCostNum = match ? parseInt(match[0], 10) : 0;
      }
      if (cost === "under10" && !(recipeCostNum < 10)) return false;
      if (cost === "under20" && !(recipeCostNum < 20)) return false;
      if (cost === "under30" && !(recipeCostNum < 30)) return false;
    }

    // Dietary tags filter
    if (dietaryTags.length > 0) {
      if (!dietaryTags.every((tag) => recipe.dietaryTags.includes(tag))) return false;
    }

    return true;
  });
}