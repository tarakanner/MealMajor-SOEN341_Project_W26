import SearchBar from "../components/SearchBar.jsx";
import { getRecipes } from "../services/recipeService.js";
import RecipeResult from "../components/RecipeResult.jsx";
import { filterRecipes } from "../services/filterRecipes.js";
import { useState, useEffect } from "react";
import RecipeFilterUI from "../components/RecipeFilterUI.jsx";

function ReceipeResultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cost, setCost] = useState("");
  const [dietaryTags, setDietaryTags] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  const userId = localStorage.getItem("userId");
  const [recipesLoaded, setRecipesLoaded] = useState(!userId);

  useEffect(() => {
    if (!userId) return;

    getRecipes(userId)
      .then((recipes) => setUserRecipes(recipes))
      .catch(() => setUserRecipes([]))
      .finally(() => setRecipesLoaded(true));
  }, [userId]);

  const handleReset = () => {
    setSearchQuery("");
    setPrepTime("");
    setDifficulty("");
    setCost("");
    setDietaryTags([]);
  };

  const filteredRecipes = filterRecipes(
    userRecipes,
    searchQuery,
    prepTime,
    difficulty,
    cost,
    dietaryTags
  );

  return (
    <div style={{ margin: "auto", width: "100%" }}>
      <SearchBar onSearch={setSearchQuery} />

      <RecipeFilterUI
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        prepTime={prepTime}
        setPrepTime={setPrepTime}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        cost={cost}
        setCost={setCost}
        dietaryTags={dietaryTags}
        setDietaryTags={setDietaryTags}
        handleReset={handleReset}
      />

      {recipesLoaded ? (
        <RecipeResult recipes={filteredRecipes} />
      ) : (
        <p style={{ textAlign: "center" }}>Loading your recipes...</p>
      )}
    </div>
  );
}

export default ReceipeResultPage;