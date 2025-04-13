// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CubeIcon, 
  CurrencyDollarIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon
} from '@heroicons/react/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock dashboard data
        const mockStats = {
          totalRevenue: 18659.25,
          totalOrders: 143,
          totalProducts: 78,
          totalCustomers: 215,
          revenueChange: 12.5,
          orderChange: 8.3,
          productChange: 4.7,
          customerChange: 15.2
        };
        
        const mockRecentOrders = [
          {
            id: 'ORD12345',
            date: '2023-08-15T10:30:00Z',
            customer: 'John Doe',
            total: 179.97,
            status: 'Delivered'
          },
          {
            id: 'ORD12346',
            date: '2023-08-14T14:45:00Z',
            customer: 'Jane Smith',
            total: 129.95,
            status: 'Shipped'
          },
          {
            id: 'ORD12347',
            date: '2023-08-14T09:15:00Z',
            customer: 'Robert Johnson',
            total: 59.97,
            status: 'Processing'
          },
          {
            id: 'ORD12348',
            date: '2023-08-13T16:20:00Z',
            customer: 'Lisa Brown',
            total: 249.99,
            status: 'Delivered'
          },
          {
            id: 'ORD12349',
            date: '2023-08-13T11:05:00Z',
            customer: 'Michael Wilson',
            total: 89.98,
            status: 'Processing'
          }
        ];
        
        const mockTopProducts = [
          {
            id: 'PROD1001',
            name: 'Premium Headphones',
            category: 'Electronics',
            sold: 42,
            revenue: 3779.58
          },
          {
            id: 'PROD1002',
            name: 'Wireless Earbuds',
            category: 'Electronics',
            sold: 38,
            revenue: 2659.00
          },
          {
            id: 'PROD1003',
            name: 'Smart Watch',
            category: 'Electronics',
            sold: 27,
            revenue: 2429.73
          },
          {
            id: 'PROD1004',
            name: 'Designer Backpack',
            category: 'Fashion',
            sold: 21,
            revenue: 1889.79
          },
          {
            id: 'PROD1005',
            name: 'Fitness Tracker',
            category: 'Sports',
            sold: 19,
            revenue: 1329.81
          }
        ];
        
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setTopProducts(mockTopProducts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Status badge color classes
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/4 mb-6 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </h2>
              <div className="flex items-center mt-2">
                {stats.revenueChange >= 0 ? (
                  <ArrowSmUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowSmDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm ${
                  stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(stats.revenueChange)}% from last month
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        {/* Orders Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Orders</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </h2>
              <div className="flex items-center mt-2">
                {stats.orderChange >= 0 ? (
                  <ArrowSmUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowSmDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm ${
                  stats.orderChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(stats.orderChange)}% from last month
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        {/* Products Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Products</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </h2>
              <div className="flex items-center mt-2">
                {stats.productChange >= 0 ? (
                  <ArrowSmUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowSmDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm ${
                  stats.productChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(stats.productChange)}% from last month
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <CubeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        {/* Customers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Customers</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalCustomers}
              </h2>
              <div className="flex items-center mt-2">
                {stats.customerChange >= 0 ? (
                  <ArrowSmUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowSmDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm ${
                  stats.customerChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(stats.customerChange)}% from last month
                </span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <Link 
              to="/admin/orders" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                      <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Selling Products</h3>
            <Link 
              to="/admin/products" 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              View All
            </Link>
          </div>
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
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                      <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.sold} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;