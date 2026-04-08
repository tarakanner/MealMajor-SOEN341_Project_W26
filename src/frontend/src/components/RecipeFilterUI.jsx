import React from "react";
import PropTypes from "prop-types";

function RecipeFilterUI({
  prepTime,
  setPrepTime,
  difficulty,
  setDifficulty,
  cost,
  setCost,
  dietaryTags,
  setDietaryTags,
  handleReset
}) {
  const handleDietaryTagChange = (tag) => {
    setDietaryTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="filter-ui">
      <label className="filter-header">
        Preparation Time: 
      </label>
      <select value={prepTime} onChange={(e) => setPrepTime(e.target.value)}>
        <option value="">Any</option>
        <option value="lt30">Less than 30 mins</option>
        <option value="lt60">Less than 1 hour</option>
        <option value="gt60">More than 1 hour</option>
      </select>
      <label className="filter-header">
        Difficulty:
      </label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">Any</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <label className="filter-header">
        Cost:
      </label>
      <select value={cost} onChange={(e) => setCost(e.target.value)}>
        <option value="">Any</option>
        <option value="under10">Under $10</option>
        <option value="under20">Under $20</option>
        <option value="under30">Under $30</option>
      </select>   
      <fieldset style={{ display: "inline-block", marginLeft: "20px"}}>
        <legend>Dietary Tags:</legend>
        {[
          "Vegan",
          "Gluten-Free",
          "High-Protein",
          "Vegetarian",
          "Dairy-Free",
        ].map((tag) => (
          <label key={tag} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={dietaryTags.includes(tag)}
              onChange={() => handleDietaryTagChange(tag)}
            />
            {tag}
          </label>
        ))}
      </fieldset>
      <button type="button" onClick={handleReset} className="blue_button">
        Clear Filters
      </button>
    </div>
  );
}

RecipeFilterUI.propTypes = {
  prepTime: PropTypes.string.isRequired,
  setPrepTime: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  cost: PropTypes.number.isRequired,
  setCost: PropTypes.func.isRequired,
  dietaryTags: PropTypes.array.isRequired,
  setDietaryTags: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default RecipeFilterUI;
