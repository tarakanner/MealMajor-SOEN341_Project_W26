import SearchBar from "../components/SearchBar.jsx";
import { templateRecipes } from "../data/templateRecipes.js";
import RecipeResult from "../components/RecipeResult.jsx";
import { filterRecipes } from "../services/filterRecipes.js";
import { useState } from "react";
import RecipeFilterUI from "../components/RecipeFilterUI.jsx";

function ReceipeResultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cost, setCost] = useState("");
  const [dietaryTags, setDietaryTags] = useState([]);

  const handleReset = () => {
    setSearchQuery("");
    setPrepTime("");
    setDifficulty("");
    setCost("");
    setDietaryTags([]);
  };

  const filteredRecipes = filterRecipes(
    templateRecipes,
    searchQuery,
    prepTime,
    difficulty,
    cost,
    dietaryTags
  );

  return (
    <>
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
        <RecipeResult recipes={filteredRecipes} />
      </div>
    </>
  );
}

export default ReceipeResultPage;
