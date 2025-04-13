// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import { SearchIcon, FilterIcon, AdjustmentsIcon } from '@heroicons/react/outline';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtering and sorting state
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      order: searchParams.get('order') || 'desc'
    };
    
    setFilters(urlFilters);
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [location.search]);
  
  // Fetch products based on filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create params object for API call
        const params = {
          ...filters,
          page: currentPage,
          limit: 12
        };
        
        const data = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, currentPage]);
  
  // Update URL with filters
  const updateURLParams = (newFilters) => {
    const searchParams = new URLSearchParams();
    
    // Only add params that have values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    if (currentPage > 1) {
      searchParams.set('page', currentPage);
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    
    // Reset to first page when filters change
    setCurrentPage(1);
    setFilters(newFilters);
    updateURLParams(newFilters);
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    updateURLParams(filters);
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
  // Categories for filter
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
  
  // Sort options
  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest' },
    { value: 'createdAt:asc', label: 'Oldest' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A-Z' },
    { value: 'name:desc', label: 'Name: Z-A' }
  ];
  
  // Handle sort change
  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split(':');
    const newFilters = { ...filters, sortBy, order };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">All Products</h1>
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300"
        >
          <FilterIcon className="h-5 w-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
          <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
            <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.filter(cat => cat !== 'All Categories').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-primary-500 focus:border-primary-500 border-l-0 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <button
              onClick={() => updateURLParams(filters)}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <select
                value={`${filters.sortBy}:${filters.order}`}
                onChange={handleSortChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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
          
          {/* Error State */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    search: '',
                    sortBy: 'createdAt',
                    order: 'desc'
                  });
                  updateURLParams({});
                }}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-l-md border ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 border-t border-b ${
                          currentPage === i + 1
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-r-md border ${
                        currentPage === totalPages
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

export default ProductsPage;