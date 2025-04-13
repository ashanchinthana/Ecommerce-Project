import React, { useState, useEffect } from 'react';
import { getProductCategories } from '../../api/productApi';
import { XIcon } from '@heroicons/react/outline';

const ProductFilter = ({ onFilterChange, initialFilters = {}, onResetFilters }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: '',
    ...initialFilters,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: '',
    });
    onResetFilters();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={handleResetFilters}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="Min"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Max"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minimum Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={filters.rating}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Any Rating</option>
            <option value="4">4★ & Above</option>
            <option value="3">3★ & Above</option>
            <option value="2">2★ & Above</option>
            <option value="1">1★ & Above</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={handleApplyFilters}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;