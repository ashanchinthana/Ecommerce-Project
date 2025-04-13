// src/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { CheckCircleIcon } from '@heroicons/react/solid';

const OrderConfirmation = () => {
  const { id: orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, you would fetch the order details from your API
    const fetchOrderDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        const mockOrder = {
          id: orderId,
          date: new Date().toISOString(),
          status: 'Processing',
          items: [
            {
              id: 'item1',
              name: 'Product 1',
              price: 79.99,
              quantity: 1,
              image: '/api/placeholder/80/80'
            },
            {
              id: 'item2',
              name: 'Product 2',
              price: 29.99,
              quantity: 2,
              image: '/api/placeholder/80/80'
            }
          ],
          subtotal: 139.97,
          shipping: 0,
          tax: 11.20,
          total: 151.17,
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'Anytown',
            state: 'ST',
            zipCode: '12345',
            country: 'United States'
          },
          paymentMethod: 'Credit Card ending in 1234'
        };
        
        setOrderDetails(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/3 mb-6 rounded"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Order Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find any order with the ID: {orderId}</p>
          <Link 
            to="/"
            className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const { date, status, items, subtotal, shipping, tax, total, shippingAddress, paymentMethod } = orderDetails;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8 flex items-start">
          <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Thank you for your order!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>
          </div>
        </div>
        
        {/* Order Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold dark:text-white">Order #{orderId}</h2>
              <p className="text-gray-600 dark:text-gray-400">Placed on {formattedDate}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400">
                {status}
              </span>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Order Details</h3>
            
            {/* Order Items */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
              {items.map(item => (
                <div key={item.id} className="py-4 flex">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div className="flex justify-between text-base font-medium dark:text-white">
                      <h4>{item.name}</h4>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium dark:text-white">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium dark:text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-base font-medium">
                    <span className="dark:text-white">Total</span>
                    <span className="dark:text-white">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping and Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Shipping Address</h3>
            <address className="not-italic text-gray-600 dark:text-gray-400">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
            </address>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Payment Method</h3>
            <p className="text-gray-600 dark:text-gray-400">{paymentMethod}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <Link 
            to="/profile"
            className="w-full sm:w-auto bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-center mb-4 sm:mb-0"
          >
            View Order History
          </Link>
          <Link 
            to="/"
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;