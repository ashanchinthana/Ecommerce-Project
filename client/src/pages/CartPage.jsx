// src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/outline';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();
  
  // Free shipping threshold
  const freeShippingThreshold = 50;
  const shippingCost = total >= freeShippingThreshold ? 0 : 5.99;
  
  // Calculate total with shipping
  const grandTotal = total + shippingCost;
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-lg mx-auto">
          <p className="text-lg mb-6">Your cart is empty</p>
          <Link 
            to="/products" 
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {cart.map((item) => {
                  const itemPrice = item.price;
                  const discountedPrice = item.discount ? itemPrice * (1 - item.discount / 100) : itemPrice;
                  const itemTotal = discountedPrice * item.quantity;
                  
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 mr-4">
                            <img 
                              src={item.images && item.images.length > 0 ? item.images[0] : '/api/placeholder/80/80'} 
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </div>
                            {item.discount > 0 && (
                              <div className="text-xs text-red-500">
                                {item.discount}% OFF
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {item.discount > 0 ? (
                            <>
                              <span className="font-medium">{formatCurrency(discountedPrice)}</span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatCurrency(itemPrice)}
                              </span>
                            </>
                          ) : (
                            formatCurrency(itemPrice)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(itemTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Link 
              to="/products" 
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Continue Shopping
            </Link>
            
            <button
              onClick={() => { /* Clear cart logic */ }}
              className="text-red-600 hover:text-red-500 dark:text-red-400 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(total)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                </span>
              </div>
              
              {total < freeShippingThreshold && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Add {formatCurrency(freeShippingThreshold - total)} more for free shipping
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;