import React, { useState, useEffect } from "react";

function SearchBar({ onSearch, placeholder = "Search our Recipes!" }) {
  const [query, setQuery] = useState("");

  // Live search as user types
  useEffect(() => {
    onSearch(query);
    // eslint-disable-next-line
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    setQuery("");
    onSearch(""); // Clear search on submit
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
          Clear
        </button>
      </form>
    </>
  );
}

export default SearchBar;
