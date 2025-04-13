import React from 'react';

const ProductSort = ({ onSortChange, currentSort }) => {
  const sortOptions = [
    { value: 'createdAt,desc', label: 'Newest Arrivals' },
    { value: 'price,asc', label: 'Price: Low to High' },
    { value: 'price,desc', label: 'Price: High to Low' },
    { value: 'rating,desc', label: 'Highest Rated' },
    { value: 'sold,desc', label: 'Best Selling' },
  ];

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split(',');
    onSortChange(sortBy, order);
  };

  return (
    <div className="flex items-center mb-6">
      <label htmlFor="sort" className="text-sm text-gray-700 dark:text-gray-300 mr-2">
        Sort by:
      </label>
      <select
        id="sort"
        value={`${currentSort.sortBy},${currentSort.order}`}
        onChange={handleSortChange}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;