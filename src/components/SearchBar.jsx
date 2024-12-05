import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBar.css';

const AutocompleteSearchBar = ({ query, setQuery }) => {
    return (
        <div className="autocomplete-search-bar">
            <FaSearch height={16} width={16} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default AutocompleteSearchBar;