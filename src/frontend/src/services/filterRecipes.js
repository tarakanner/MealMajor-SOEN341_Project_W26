export function filterRecipes(
  recipes,
  search = "",
  prepTime = "",
  difficulty = "",
  cost = "",
  dietaryTags = [],
) {
  const query = search.trim().toLowerCase();
  return recipes.filter((recipe) => {
    // Search filter — match name or any ingredient
    const recipeText = [
      recipe.name || "",
      recipe.preparationTime || recipe.prepTime || "",
      recipe.cost || "",
      recipe.difficulty || "",
      Array.isArray(recipe.ingredients) ? recipe.ingredients.join(" ") : "",
      Array.isArray(recipe.preparationSteps) ? recipe.preparationSteps.join(" ") : Array.isArray(recipe.steps) ? recipe.steps.join(" ") : "",
      Array.isArray(recipe.dietaryTags) ? recipe.dietaryTags.join(" ") : "",
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
      if (!dietaryTags.every((tag) => recipe.dietaryTags.includes(tag)))
        return false;
    }

    return true;
  });
}

/**
 * Filter recipes based on user preferences (dietary restrictions & allergies).
 * - If the user has dietary restrictions, only recipes whose dietaryTags
 *   include at least one of those restrictions are kept.
 * - If the user has allergies, any recipe whose ingredients mention an
 *   allergen is excluded.
 */
export function filterByPreferences(recipes, preferences) {
  if (!preferences) return recipes;

  const {
    dietaryRestrictions = [],
    allergies = [],
    otherAllergy = "",
  } = preferences;

  // Normalise dietary restrictions for case-insensitive comparison
  const activeRestrictions = dietaryRestrictions
    .filter((r) => r && r !== "none")
    .map((r) => r.toLowerCase());

  // Build a single list of allergens (including "other")
  const allergenList = [...allergies.map((a) => a.toLowerCase())];
  if (otherAllergy && otherAllergy.trim()) {
    allergenList.push(otherAllergy.trim().toLowerCase());
  }

  return recipes.filter((recipe) => {
    // --- Dietary restriction match ---
    // If the user specified restrictions, keep only recipes that carry
    // at least one matching dietaryTag.
    if (activeRestrictions.length > 0) {
      const recipeTags = (recipe.dietaryTags || []).map((t) => t.toLowerCase());
      const hasMatch = activeRestrictions.some((r) => recipeTags.includes(r));
      if (!hasMatch) return false;
    }

    // --- Allergy exclusion ---
    // If any ingredient text mentions an allergen, exclude the recipe.
    if (allergenList.length > 0) {
      const ingredientText = (recipe.ingredients || []).join(" ").toLowerCase();
      const containsAllergen = allergenList.some((allergen) =>
        ingredientText.includes(allergen),
      );
      if (containsAllergen) return false;
    }

    return true;
  });
}
