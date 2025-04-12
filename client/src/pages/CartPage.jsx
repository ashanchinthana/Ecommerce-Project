import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { XIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline';

const CartPage = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  // Show skeleton loader while cart is loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
              <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          <h2 className="mt-4 text-2xl font-medium text-gray-900 dark:text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Looks like you haven't added any products to your cart yet.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cart Items ({cart.items.length})
              </h2>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="py-6 flex flex-wrap md:flex-nowrap">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0 mb-4 md:mb-0">
                      <img
                        src={item.product.images && item.product.images.length > 0 
                          ? item.product.images[0] 
                          : '/assets/images/default-product.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="md:ml-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            <Link to={`/products/${item.product._id}`}>{item.product.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.product.brand}
                          </p>
                          {item.product.discount > 0 && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {item.product.discount}% OFF
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          {item.product.discount > 0 ? (
                            <div className="flex items-baseline space-x-2">
                              <span className="text-lg font-medium text-gray-900 dark:text-white">
                                {formatCurrency(item.product.price * (1 - item.product.discount / 100))}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {formatCurrency(item.product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                              {formatCurrency(item.product.price)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            className="p-2 text-gray-600 dark:text-gray-400"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            className="p-2 text-gray-600 dark:text-gray-400"
                            disabled={item.quantity >= item.product.countInStock}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Subtotal: {formatCurrency(
                            item.quantity * 
                            (item.product.discount > 0 
                              ? item.product.price * (1 - item.product.discount / 100) 
                              : item.product.price)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(cart.total)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(cart.total >= 50 ? 0 : 5.99)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(cart.total * 0.08)}
                </span>
              </div>
              
              {cart.total >= 50 && (
                <div className="text-green-600 dark:text-green-400 text-sm py-2">
                  You've qualified for free shipping!
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      cart.total + (cart.total >= 50 ? 0 : 5.99) + cart.total * 0.08
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Secure checkout message */}
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <svg
                className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;