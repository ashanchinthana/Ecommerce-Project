// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { SearchIcon, XIcon, AdjustmentsIcon } from '@heroicons/react/outline';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import { getProducts } from '../api/productApi';
import { formatCurrency } from '../utils/formatCurrency';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get current search params
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    query,
    category,
    minPrice,
    maxPrice,
    sortBy
  });
  
  // Track search history in local storage
  useEffect(() => {
    if (query.trim()) {
      // Get current search history from localStorage
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      
      // Add current search term if not already in history
      if (!searchHistory.includes(query)) {
        const updatedHistory = [query, ...searchHistory.slice(0, 9)]; // Keep last 10 searches
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    }
  }, [query]);
  
  // Fetch products based on search params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Prepare query parameters for API
        const params = {
          search: query,
          category: category,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sortBy: sortBy.includes(':') ? sortBy.split(':')[0] : undefined,
          order: sortBy.includes(':') ? sortBy.split(':')[1] : undefined,
          page: page,
          limit: 12 // Products per page
        };
        
        // Call API to get filtered products
        const result = await getProducts(params);
        setProducts(result.products);
        setTotalProducts(result.total);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category, minPrice, maxPrice, sortBy, page]);
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newFilters = { ...appliedFilters, [name]: value };
    
    // Reset to page 1 when changing filters
    if (name !== 'page') {
      newFilters.page = 1;
    }
    
    setAppliedFilters(newFilters);
    
    // Update URL with new filters
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        newSearchParams.set(key, val);
      }
    });
    
    setSearchParams(newSearchParams);
  };
  
  // Handle removing a filter
  const removeFilter = (filterName) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filterName];
    
    setAppliedFilters(newFilters);
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        newSearchParams.set(key, val);
      }
    });
    
    setSearchParams(newSearchParams);
  };
  
  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('searchQuery');
    
    if (searchQuery.trim()) {
      handleFilterChange('query', searchQuery);
    }
  };
  
  // Categories for filtering
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty',
    'Books',
    'Sports',
    'Toys'
  ];
  
  // Sorting options
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'createdAt:desc', label: 'Newest Arrivals' },
    { value: 'name:asc', label: 'Name: A-Z' },
    { value: 'name:desc', label: 'Name: Z-A' }
  ];
  
  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / 12);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            name="searchQuery"
            defaultValue={query}
            placeholder="Search products..."
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-primary-600 text-white px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Filter and Results Area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300"
          >
            <AdjustmentsIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Applied Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {query && (
              <div className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm dark:bg-gray-700 dark:text-gray-300">
                <span>Search: {query}</span>
                <button
                  onClick={() => removeFilter('query')}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {category && (
              <div className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm dark:bg-gray-700 dark:text-gray-300">
                <span>Category: {category}</span>
                <button
                  onClick={() => removeFilter('category')}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {minPrice && (
              <div className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm dark:bg-gray-700 dark:text-gray-300">
                <span>Min Price: ${minPrice}</span>
                <button
                  onClick={() => removeFilter('minPrice')}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {maxPrice && (
              <div className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm dark:bg-gray-700 dark:text-gray-300">
                <span>Max Price: ${maxPrice}</span>
                <button
                  onClick={() => removeFilter('maxPrice')}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* Clear all filters button */}
            {(query || category || minPrice || maxPrice) && (
              <button
                onClick={() => {
                  // Keep only sortBy parameter
                  const sortValue = appliedFilters.sortBy;
                  setAppliedFilters({ sortBy: sortValue });
                  
                  const newSearchParams = new URLSearchParams();
                  if (sortValue !== 'relevance') {
                    newSearchParams.set('sortBy', sortValue);
                  }
                  
                  setSearchParams(newSearchParams);
                }}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Sidebar - visible on desktop or when toggled on mobile */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
          <FilterSidebar
            categories={categories}
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Results Count and Sort Options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
              {loading ? (
                <span>Searching...</span>
              ) : (
                <span>
                  Showing {products.length} of {totalProducts} results
                  {query && <span> for "{query}"</span>}
                </span>
              )}
            </p>
            
            {/* Sort Dropdown */}
            <div>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="py-1 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 dark:bg-red-900/30 dark:text-red-400">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-80 animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!loading && !error && products.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Link to="/products" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
                View all products
              </Link>
            </div>
          )}
          
          {/* Product Grid */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handleFilterChange('page', page - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-l-md border ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // Logic to limit visible page numbers
                      if (
                        i === 0 || // First page
                        i === totalPages - 1 || // Last page
                        (i >= page - 2 && i <= page) || // Current and two previous
                        (i >= page && i <= page + 1) // Current and one next
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => handleFilterChange('page', i + 1)}
                            className={`px-4 py-2 border-t border-b ${
                              page === i + 1
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (
                        (i === 1 && page > 3) || 
                        (i === totalPages - 2 && page < totalPages - 2)
                      ) {
                        // Show ellipsis for page gaps
                        return (
                          <span 
                            key={i}
                            className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handleFilterChange('page', page + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-r-md border ${
                        page === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;