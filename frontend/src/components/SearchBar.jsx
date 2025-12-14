import React, { useState } from 'react';

const SearchBar = ({ onSearch, sweets }) => {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const categories = [...new Set(sweets.map(sweet => sweet.category))];

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        name="name"
        placeholder="Search by name..."
        value={filters.name}
        onChange={handleChange}
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
        min="0"
        step="0.01"
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
        min="0"
        step="0.01"
      />
      <button type="button" className="btn btn-secondary" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

export default SearchBar;

