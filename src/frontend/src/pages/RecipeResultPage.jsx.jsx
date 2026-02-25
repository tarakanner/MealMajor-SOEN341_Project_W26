import SearchBar from "../components/SearchBar";
import { templateRecipes } from "../data/templateRecipes";
import RecipeResult from "../components/RecipeResult.jsx";

function ReceipeResultPage() {
  return (
    <>
      <div style={{ margin: "auto", width: "100%" }}>
        <SearchBar onSearch={(query) => console.log("Search query:", query)} />

        <RecipeResult recipes={templateRecipes} />
      </div>
    </>
  );
}

export default ReceipeResultPage;
