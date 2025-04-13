import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  // If loading, show skeleton loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no products found
  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  // Render products grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;