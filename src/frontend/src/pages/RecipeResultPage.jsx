import SearchBar from "../components/SearchBar.jsx";
import { templateRecipes } from "../data/templateRecipes.js";
import RecipeResult from "../components/RecipeResult.jsx";
import { filterRecipes } from "../services/filterRecipes.js";
import { useState } from "react";
<<<<<<< Updated upstream
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

=======
import RecipeFilter from "../components/RecipeFilter.jsx";

function ReceipeResultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    diet: "",
    costMin: "",
    costMax: "",
    difficulty: "",
  });
  const filteredRecipes = filterRecipes(templateRecipes, searchQuery, filters);
>>>>>>> Stashed changes
  return (
    <>
      <div
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: 900,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          padding: 24,
          marginTop: 32,
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2e77ca", marginBottom: 16 }}>
          Find Your Recipe
        </h2>
        <SearchBar onSearch={setSearchQuery} />
<<<<<<< Updated upstream
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
=======
        <RecipeFilter filters={filters} onChange={setFilters} />
>>>>>>> Stashed changes
        <RecipeResult recipes={filteredRecipes} />
      </div>
    </>
  );
}

export default ReceipeResultPage;
