// src/components/profile/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch orders from your API
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        const mockOrders = [
          {
            id: 'ORD12345',
            date: '2023-08-15T10:30:00Z',
            total: 179.97,
            status: 'Delivered',
            items: [
              { id: 'item1', name: 'Product 1', price: 79.99, quantity: 1 },
              { id: 'item2', name: 'Product 2', price: 49.99, quantity: 2 }
            ]
          },
          {
            id: 'ORD12346',
            date: '2023-07-22T14:45:00Z',
            total: 129.95,
            status: 'Shipped',
            items: [
              { id: 'item3', name: 'Product 3', price: 129.95, quantity: 1 }
            ]
          },
          {
            id: 'ORD12347',
            date: '2023-07-10T09:15:00Z',
            total: 59.97,
            status: 'Processing',
            items: [
              { id: 'item4', name: 'Product 4', price: 19.99, quantity: 3 }
            ]
          }
        ];
        
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/3 mb-6 rounded"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">No Orders Yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
        <Link
          to="/products"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Order History</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4">
              <div className="flex flex-wrap justify-between items-center">
                <div className="mb-2 md:mb-0">
                  <h3 className="text-sm font-medium dark:text-white">
                    Order #{order.id}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="p-4">
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="text-sm dark:text-white">
                        <span className="font-medium">{item.quantity} x </span>
                        {item.name}
                      </div>
                    </div>
                    <div className="text-sm font-medium dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between">
                <span className="font-medium dark:text-white">Total</span>
                <span className="font-medium dark:text-white">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;