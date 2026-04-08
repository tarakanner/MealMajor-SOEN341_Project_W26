import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";

function SearchBar({
  onSearch,
  placeholder = "Search by name or ingredient...",
}) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Live-filter as the user types
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <>
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-button">
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="searchbar-button"
        >
          Clear
        </button>
      </form>
    </>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
