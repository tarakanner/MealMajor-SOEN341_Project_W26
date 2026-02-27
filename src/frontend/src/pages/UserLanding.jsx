import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../services/authService";
import { getPreferences } from "../services/preferencesService";
import SearchBar from "../components/SearchBar";
import RecipeFilterUI from "../components/RecipeFilterUI";
import RecipeResult from "../components/RecipeResult.jsx";

import { templateRecipes } from "../data/templateRecipes";
import { filterRecipes, filterByPreferences } from "../services/filterRecipes";

function LandingPage() {
  const [userName] = useState(() => {
    const storedUserName = getUserName();
    return storedUserName || "User";
  });
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // User preferences loaded from backend
  const [preferences, setPreferences] = useState(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cost, setCost] = useState("");
  const [dietaryTags, setDietaryTags] = useState([]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Fetch the user's saved preferences
    const userId = localStorage.getItem("userId");
    const loadPreferences = async () => {
      if (userId) {
        try {
          const prefs = await getPreferences(userId);
          setPreferences(prefs);
        } catch {
          // No preferences saved yet — show all recipes
        }
      }
      setPrefsLoaded(true);
    };

    loadPreferences();
  }, []);

  const handleReset = () => {
    setSearchQuery("");
    setPrepTime("");
    setDifficulty("");
    setCost("");
    setDietaryTags([]);
  };

  // 1) Start with all template recipes
  // 2) Narrow down by user preferences (dietary restrictions & allergies)
  // 3) Apply the search query + additional filters
  const preferenceRecipes = filterByPreferences(templateRecipes, preferences);
  const filteredRecipes = filterRecipes(
    preferenceRecipes,
    searchQuery,
    prepTime,
    difficulty,
    cost,
    dietaryTags,
  );

  return (
    <>
      <div style={{ margin: "auto", width: "100%" }}>
        <br />
        <h2 style={{ textAlign: "center" }}>Welcome back {userName}!</h2>

        <button className="search-button" onClick={() => navigate("/search")}>
          Search ALL Recipes
        </button>

        <h3 style={{ textAlign: "center" }}>Recipes customized for you:</h3>

        {/* Search bar — filters by name or ingredient */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Advanced filters */}
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

        {/* Recipe results with "No recipes found" handled inside */}
        {prefsLoaded ? (
          <RecipeResult recipes={filteredRecipes} />
        ) : (
          <p style={{ textAlign: "center" }}>Loading your recipes...</p>
        )}
      </div>
    </>
  );
}

export default LandingPage;
