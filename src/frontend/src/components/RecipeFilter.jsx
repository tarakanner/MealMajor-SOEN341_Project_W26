import React, { useState } from "react";

const defaultFilters = {
  diet: "",
  costMin: "",
  costMax: "",
  difficulty: "",
};

export default function RecipeFilter({ filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters || defaultFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  return (
    <div
      className="recipe-filter"
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20,
        background: "#f8fafc",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <label
        style={{ display: "flex", flexDirection: "column", minWidth: 120 }}
      >
        Diet:
        <input
          name="diet"
          value={localFilters.diet}
          onChange={handleChange}
          placeholder="e.g. vegan, gluten-free"
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d1d1d1",
            marginTop: 4,
          }}
        />
      </label>
      <label
        style={{ display: "flex", flexDirection: "column", minWidth: 120 }}
      >
        Cost ($):
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <input
            name="costMin"
            type="number"
            min="0"
            value={localFilters.costMin}
            onChange={handleChange}
            placeholder="Min"
            style={{
              width: 60,
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d1d1",
            }}
          />
          <span>-</span>
          <input
            name="costMax"
            type="number"
            min="0"
            value={localFilters.costMax}
            onChange={handleChange}
            placeholder="Max"
            style={{
              width: 60,
              padding: 6,
              borderRadius: 6,
              border: "1px solid #d1d1d1",
            }}
          />
        </div>
      </label>
      <label
        style={{ display: "flex", flexDirection: "column", minWidth: 120 }}
      >
        Difficulty:
        <select
          name="difficulty"
          value={localFilters.difficulty}
          onChange={handleChange}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d1d1d1",
            marginTop: 4,
          }}
        >
          <option value="">Any</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
    </div>
  );
}
