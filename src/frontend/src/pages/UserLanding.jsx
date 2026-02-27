import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserName } from "../services/authService";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { templateRecipes } from "../data/templateRecipes";
import RecipeResult from "../components/RecipeResult.jsx";
import { getPreferences } from "../services/preferencesService";
import { filterRecipes } from "../services/filterRecipes";

export default function LandingPage() {
  const [userName] = useState(() => getUserName() || "User");
  const [userRecipes, setUserRecipes] = useState(templateRecipes);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch and filter recipes by user preferences
    const fetchAndFilter = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const prefs = await getPreferences(userId);
        // Build filter object for filterRecipes
        const filters = {
          diet:
            Array.isArray(prefs.dietaryRestrictions) &&
            prefs.dietaryRestrictions.length > 0
              ? prefs.dietaryRestrictions[0]
              : "",
        };
        // Optionally, filter out recipes with user's allergies
        let filtered = filterRecipes(templateRecipes, "", filters);
        if (Array.isArray(prefs.allergies) && prefs.allergies.length > 0) {
          const allergySet = new Set(
            prefs.allergies.map((a) => a.toLowerCase()),
          );
          filtered = filtered.filter(
            (recipe) =>
              !recipe.ingredients.some((ingredient) =>
                Array.from(allergySet).some((allergy) =>
                  ingredient.toLowerCase().includes(allergy),
                ),
              ),
          );
        }
        setUserRecipes(filtered);
      } catch {
        // fallback: show all recipes
        setUserRecipes(templateRecipes);
      }
    };
    fetchAndFilter();
  }, []);

  return (
    <>
      <div style={{ margin: "auto", width: "100%" }}>
        <br></br>
        <h2 style={{ textAlign: "center" }}>Welcome back {userName}!</h2>
        <button className="search-button" onClick={() => navigate("/search")}>
          Search ALL Recipes
        </button>
        <h3 style={{ textAlign: "center" }}>
          These are the Recipes customized for you:
        </h3>
        <RecipeResult recipes={userRecipes} />
      </div>
    </>
  );
}
