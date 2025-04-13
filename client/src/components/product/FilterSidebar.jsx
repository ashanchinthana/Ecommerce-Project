// src/components/product/FilterSidebar.jsx
import React, { useState } from 'react';

const FilterSidebar = ({ categories, selectedCategory, minPrice, maxPrice, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({
    min: minPrice || '',
    max: maxPrice || ''
  });
  
  // Handle category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value === 'All Categories' ? '' : e.target.value;
    onFilterChange('category', category);
  };
  
  // Handle price range input changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply price filter
  const applyPriceFilter = () => {
    onFilterChange('minPrice', priceRange.min);
    onFilterChange('maxPrice', priceRange.max);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                name="category"
                value={category}
                checked={category === selectedCategory || (category === 'All Categories' && !selectedCategory)}
                onChange={handleCategoryChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-full"
              />
              <label
                htmlFor={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Price Range</h3>
        <div className="flex items-center space-x-2 mb-3">
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="Min"
              className="pl-7 pr-2 py-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Max"
              className="pl-7 pr-2 py-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={applyPriceFilter}
          className="w-full bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Apply Price
        </button>
      </div>
      
      {/* Additional filters can be added here */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              name="availability"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on-sale"
              name="sale"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="on-sale" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              On Sale
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Customer Ratings</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="checkbox"
                id={`rating-${rating}`}
                name="rating"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="ml-1">& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;