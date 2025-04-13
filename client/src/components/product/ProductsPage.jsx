import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import ProductSort from '../components/product/ProductSort';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    brand: queryParams.get('brand') || '',
    rating: queryParams.get('rating') || '',
  });
  const [sort, setSort] = useState({
    sortBy: queryParams.get('sortBy') || 'createdAt',
    order: queryParams.get('order') || 'desc',
  });

  // Fetch products with filters and sorting
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      
      const queryFilters = {
        page,
        limit: 12,
        sortBy: sort.sortBy,
        order: sort.order,
      };
      
      // Add search term if present
      if (searchTerm) {
        queryFilters.search = searchTerm;
      }
      
      // Add other filters if present
      if (filters.category) queryFilters.category = filters.category;
      if (filters.brand) queryFilters.brand = filters.brand;
      if (filters.minPrice) queryFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) queryFilters.maxPrice = filters.maxPrice;
      if (filters.rating) queryFilters.rating = filters.rating;
      
      const response = await getProducts(queryFilters);
      setProducts(response.products);
      setTotalPages(response.pagination.totalPages);
      setCurrentPage(page);
      
      // Update URL with query parameters
      updateUrlQueryParams(queryFilters);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update URL query parameters
  const updateUrlQueryParams = (queryFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(queryFilters).forEach(([key, value]) => {
      if (value && key !== 'page' && key !== 'limit') {
        params.set(key, value);
      }
    });
    
    if (currentPage > 1) {
      params.set('page', currentPage);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };

  // Initial load and when query params change
  useEffect(() => {
    fetchProducts(parseInt(queryParams.get('page') || '1'));
  }, [location.search]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(1);
    setShowMobileFilter(false);
  };

  // Handle sort changes
  const handleSortChange = (sortBy, order) => {
    setSort({ sortBy, order });
    fetchProducts(1);
  };

  // Handle page changes
  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: '',
    });
    fetchProducts(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {filters.category ? filters.category : 'All Products'}
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            <FilterIcon className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Filters</span>
          </button>
        </div>

        {/* Left sidebar (Filter) */}
        <div className={`md:w-1/4 md:pr-6 ${showMobileFilter ? 'block' : 'hidden md:block'}`}>
          <ProductFilter
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          {/* Sort controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {products.length} products
            </div>
            <ProductSort onSortChange={handleSortChange} currentSort={sort} />
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md mb-6">
              <p className="text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={() => fetchProducts(currentPage)}
                className="mt-2 text-red-700 dark:text-red-400 underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages).keys()].map((page) => {
                  const pageNumber = page + 1;
                  // Show current page, first and last page, and one page before and after current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    pageNumber === currentPage ||
                    pageNumber === currentPage - 1 ||
                    pageNumber === currentPage + 1
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:border-primary-500 dark:text-primary-300'
                            : 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show ellipsis for gaps
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;