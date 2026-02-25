import React from "react";
import { useState } from "react";

function SearchBar({ onSearch, placeholder = "Search our Recipes!" }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    //avoids empty submit
    if (!trimmedQuery) return;
    setQuery("");
    onSearch(trimmedQuery);
  };

  return (
    <>
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-button">
          Search
        </button>
        <button
          type="submit"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="searchbar-button"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default SearchBar;
