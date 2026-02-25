import SearchBar from "../components/SearchBar.jsx";
import { templateRecipes } from "../data/templateRecipes.js";
import RecipeResult from "../components/RecipeResult.jsx";
import { filterRecipes } from "../services/filterRecipes.js";
import { useState } from "react";

function ReceipeResultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRecipes = filterRecipes(templateRecipes, searchQuery);
  return (
    <>
      <div style={{ margin: "auto", width: "100%" }}>
        <SearchBar onSearch={setSearchQuery} />

        <RecipeResult recipes={filteredRecipes} />
      </div>
    </>
  );
}

export default ReceipeResultPage;
