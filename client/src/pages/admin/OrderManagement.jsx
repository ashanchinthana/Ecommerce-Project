// src/pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  SearchIcon, 
  FilterIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  
  useEffect(() => {
    // In a real app, fetch orders from your API
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock orders
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const mockOrders = Array.from({ length: 50 }, (_, i) => ({
          id: `ORD${100000 + i}`,
          customer: {
            id: `CUST${200000 + i}`,
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`
          },
          date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
          total: (Math.random() * 500 + 50).toFixed(2),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          items: Math.floor(Math.random() * 5) + 1
        }));
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Status badge styles
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };
  
  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    // In a real app, you would call an API to update the order status
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Order Management</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row mb-6 gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="sm:w-60">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link to={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400">
                          View
                        </Link>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center">
                            Update <ChevronDownIcon className="ml-1 h-4 w-4" />
                          </button>
                          <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block dark:bg-gray-700">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusUpdate(order.id, status)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  order.status === status 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastOrder, filteredOrders.length)}
            </span>{' '}
            of <span className="font-medium">{filteredOrders.length}</span> orders
          </div>
          
          <div className="flex space-x-2">
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
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              // Logic to show appropriate page numbers
              let pageNum;
              if (totalPages <= 5) {
                // Show all pages if 5 or fewer
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                // Show first 5 pages
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                pageNum = totalPages - 4 + index;
              } else {
                // Show current page and 2 pages on each side
                pageNum = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`inline-flex items-center px-3 py-1 border rounded-md ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white border-primary-600 dark:bg-primary-700 dark:border-primary-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
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
    </div>
  );
};

export default OrderManagement;