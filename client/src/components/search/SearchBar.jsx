// src/components/search/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, ClockIcon, TrendingUpIcon, XIcon } from '@heroicons/react/outline';

const SearchBar = ({ placeholder = 'Search products...', showHistory = true, showPopular = true }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSearches, setPopularSearches] = useState([
    'headphones', 'smartphones', 'laptops', 'cameras', 'smart watch'
  ]);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Load search history from localStorage
  useEffect(() => {
    if (showHistory) {
      const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      setSearchHistory(storedHistory);
    }
  }, [showHistory]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search submission
  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    // Save to search history
    if (showHistory) {
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(item => item !== searchQuery).slice(0, 9)
      ];
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    }
    
    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsOpen(false);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  
  // Handle clear search history
  const clearSearchHistory = (e) => {
    e.stopPropagation();
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
  };
  
  return (
    <div className="relative">
      // src/components/search/SearchBar.jsx (continued)
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </form>
      
      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800 max-h-80 overflow-y-auto"
        >
          {/* Show recent searches */}
          {showHistory && searchHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>Recent Searches</span>
                </div>
                <button 
                  onClick={clearSearchHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              <ul>
                {searchHistory.map((item, index) => (
                  <li key={`history-${index}`}>
                    <button
                      onClick={() => handleSearch(item)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center"
                    >
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Show popular searches */}
          {showPopular && popularSearches.length > 0 && (
            <div>
              <div className="flex items-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                <TrendingUpIcon className="h-4 w-4 mr-2" />
                <span>Popular Searches</span>
              </div>
              <ul>
                {popularSearches
                  .filter(item => item.includes(query.toLowerCase()))
                  .slice(0, 5)
                  .map((item, index) => (
                    <li key={`popular-${index}`}>
                      <button
                        onClick={() => handleSearch(item)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center"
                      >
                        <TrendingUpIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {item}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          
          {/* Show matched results as you type */}
          {query.length > 1 && (
            <div>
              <div className="flex items-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                <SearchIcon className="h-4 w-4 mr-2" />
                <span>Search for "{query}"</span>
              </div>
              <button
                onClick={() => handleSearch(query)}
                className="w-full text-left px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
          
          {/* No results message */}
          {query.length > 1 && !searchHistory.length && !popularSearches.some(s => s.includes(query.toLowerCase())) && (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <p>No matching results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;