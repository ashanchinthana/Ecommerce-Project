// src/pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import ProductForm from '../../components/admin/ProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Category options
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
  
  useEffect(() => {
    // In a real app, fetch products from your API
    const fetchProducts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock products
        const mockCategories = categories.filter(c => c !== 'All Categories');
        const mockProducts = Array.from({ length: 50 }, (_, i) => ({
          id: `PROD${1000 + i}`,
          name: `Product ${i + 1}`,
          description: `This is a description for Product ${i + 1}. It includes some details about the product features and benefits.`,
          price: (Math.random() * 200 + 10).toFixed(2),
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
          category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
          stock: Math.floor(Math.random() * 100),
          featured: Math.random() > 0.8,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
          image: '/api/placeholder/200/200',
        }));
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter and search products
  const filteredProducts = products.filter(product => {
    // Apply category filter
    if (categoryFilter !== 'all' && categoryFilter !== 'All Categories' && product.category !== categoryFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Open modal for adding a new product
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setModalMode('add');
    setShowProductModal(true);
  };
  
  // Open modal for editing a product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setModalMode('edit');
    setShowProductModal(true);
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId) => {
    // In a real app, you would call an API to delete the product
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    }
  };
  
  // Handle form submission
  const handleProductSubmit = (productData) => {
    if (modalMode === 'add') {
      // In a real app, you would call an API to add the product
      const newProduct = {
        id: `PROD${1000 + products.length}`,
        ...productData,
        createdAt: new Date().toISOString()
      };
      
      setProducts(prevProducts => [...prevProducts, newProduct]);
    } else {
      // In a real app, you would call an API to update the product
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === currentProduct.id ? { ...product, ...productData } : product
        )
      );
    }
    
    setShowProductModal(false);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/4 mb-6 rounded"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/3 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/4 rounded"></div>
          </div>
          <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Product Management</h1>
        
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row mb-6 gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="sm:w-60">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'All Categories').map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(Number(product.price))}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-xs text-red-600 dark:text-red-400">
                          {product.discount}% off
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex text-sm ${
                        product.stock > 10
                          ? 'text-green-800 dark:text-green-400'
                          : product.stock > 0
                            ? 'text-yellow-800 dark:text-yellow-400'
                            : 'text-red-800 dark:text-red-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.featured ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No products found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination - similar structure to OrderManagement */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastProduct, filteredProducts.length)}
            </span>{' '}
            of <span className="font-medium">{filteredProducts.length}</span> products
          </div>
          
          <div className="flex space-x-2">
            {/* Pagination controls - same as in OrderManagement */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            {/* Page number buttons - same structure as OrderManagement */}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 border rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Product Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                </h3>
                
                <ProductForm 
                  product={currentProduct}
                  categories={categories.filter(cat => cat !== 'All Categories')}
                  onSubmit={handleProductSubmit}
                  onCancel={() => setShowProductModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;